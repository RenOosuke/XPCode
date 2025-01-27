window.addEventListener('beforeunload', () => {
    processessCleanQueue.forEach(cleanUpFunction => {
        cleanUpFunction();
    })
});

/** @type {<fallbackParameter>(_path: PathLike, secondaryData: {format: BufferEncoding, errorCallback: Function | undefined, safeFallback: fallbackParameter | undefined}) => undefined | fallbackParameter} */
const readJSON = (_path, secondaryData = {}) => {
    let dataToReturn;
    let {format = 'utf-8', errorCallback, safeFallback} = secondaryData;

    try {
        dataToReturn = JSON.parse(fs.readFileSync(_path, format));
    } catch(e) {
        dataToReturn = safeFallback;

        if(errorCallback) {
            errorCallback(e);
        }
    }

    return dataToReturn
}

/**
 * Reads a JSON file and parses it into a JavaScript object (promisified for Node.js 6).
 * @param {PathLike} _path - Path to the JSON file.
 * @param {Object} [secondaryData] - Optional settings.
 * @param {BufferEncoding} [secondaryData.format='utf-8'] - File encoding.
 * @param {any} [secondaryData.safeFallback] - Fallback value if an error occurs.
 * @returns {Promise<any>} - Resolves with the parsed JSON or the fallback value.
 */
const readJSONasync = (_path, secondaryData = {}) => {
    const { format = 'utf-8', safeFallback } = secondaryData;

    return new Promise((resolve, reject) => {
        fs.readFile(_path, format, (err, data) => {
            if (err) {
                return resolve(safeFallback); // Use fallback on error
            }

            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (parseErr) {
                resolve(safeFallback); // Use fallback on parsing error
            }
        });
    });
};

/**
 * Writes a JavaScript object to a JSON file (promisified for Node.js 6).
 * @param {PathLike} _path - Path to the JSON file.
 * @param {any} data - Data to be written to the file.
 * @param {Object} [secondaryData] - Optional settings.
 * @param {BufferEncoding} [secondaryData.format='utf-8'] - File encoding.
 * @returns {Promise<void>} - Resolves when the file is successfully written.
 */
const writeJSONasync = (_path, data, secondaryData = {}) => {
    const { format = 'utf-8' } = secondaryData;

    return new Promise((resolve, reject) => {
        let jsonData;
        try {
            jsonData = JSON.stringify(data, null, 2); // Pretty formatting
        } catch (stringifyErr) {
            return reject(stringifyErr); // Reject if JSON serialization fails
        }

        fs.writeFile(_path, jsonData, format, (err) => {
            if (err) {
                return reject(err); // Reject if file write fails
            }
            resolve(); // Resolve on success
        });
    });
};

/**
 * Function to replace object spread operator.
 * Merges objects into a new object.
 *
 * @param {...Object} objects - Objects to merge.
 * @returns {Object} - A new object with merged properties.
 */
function spreader(...objects) {
    return Object.assign({}, ...objects);
  }
  

// FS

const copyFile = (src, dest, callback) => {
    const readStream = fs.createReadStream(src);
    const writeStream = fs.createWriteStream(dest);

    readStream.on('error', callback);
    writeStream.on('error', callback);
    writeStream.on('close', () => callback(null));

    readStream.pipe(writeStream);
};

