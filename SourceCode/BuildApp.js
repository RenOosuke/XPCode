// #DOCUMENT_THIS_FILE
const SDK = false;
// TO OPTIMIZE DOWNLOAD URLS 
// #NWBUILD_DOWNLOAD_OPTIMIZE
const projectName = 'XPCode';
const versionNumber = '0.12.3'; // 0.13+ has an issue where if you don't have an internet on the machine, NWjs would insta crash. Also, the startup of 0.13 is around 5 times faster.
const platform = 'win'
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const decompress = require('decompress');
const shouldCompileBinaries = true;

const NWVersions = {
    '0.12.3': {
        sdk: {
            win: {
                url: 'https://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-win-ia32.zip',
                name: 'nwjs-v0.12.3-win-ia32'
            }
        },
        normal: {
            win: {
                url: 'https://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-win-ia32.zip',
                name: 'nwjs-v0.12.3-win-ia32'
            }
        }
    },
    '0.15.4': {
        sdk: {
            win: {
                url: 'https://dl.nwjs.io/v0.15.4/nwjs-sdk-symbol-v0.15.4-win-ia32.7z',
                name: 'nwjs-sdk-v0.15.4-win-ia32'
            }
        },
        normal: {
            win: {
                url: 'https://dl.nwjs.io/v0.15.4/nwjs-v0.15.4-win-ia32.zip',
                name: 'nwjs-v0.15.4-win-ia32'
            }
        }
    }
};

const createIfNotExists = (folderPath) => {
    if(!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, {recursive: true})
    }
};

let pathsToMove = [
    'fonts',
    'images',
    'public',
    'src-noconflict'
].map(a => path.join(__dirname, a));

let publicPath = path.join(__dirname, 'public');

let filterFromMassCopy = [
    ...[
        'package.json',
        'package-lock.json',
        'node_modules'
    ].map(a => path.join(publicPath, a)),    
];

const copyPath = (dirPath, destPath, dontCheckFilter) => {
    let basename = path.basename(dirPath);

    let isFolder = fs.lstatSync(dirPath).isDirectory();
    let newDestPath = path.join(destPath, basename);

    
    if(dontCheckFilter || !filterFromMassCopy.includes(dirPath)) {
        if(isFolder) {
            createIfNotExists(newDestPath);
    
            let folderFiles = fs.readdirSync(dirPath, {
                withFileTypes: true
            });
    
            folderFiles.map(subPath => {
                copyPath(path.join(subPath.path, subPath.name), newDestPath);
            })
        } else {
            fs.copyFileSync(dirPath, newDestPath);
        }  
    } 
}

let buildAppPath = path.resolve(`${__dirname}/../BuiltApp`);
let projectExePath = path.join(buildAppPath, projectName);
let nwPackagePath = path.join(projectExePath, 'package.nw');

const copyProjectFiles = () => {
    createIfNotExists(nwPackagePath);
    
    pathsToMove.forEach(dirPath => {
        copyPath(dirPath, nwPackagePath);
    });
    
    let packageJsonPath = path.join(publicPath, 'package.json');
    copyPath(packageJsonPath, nwPackagePath, true);
}

const installNPMPackages = () => {
    let npmInstallScriptPath = path.resolve(path.join(__dirname, 'BuildAppTools', 'npmInstall.cmd'))
    child_process.execSync(npmInstallScriptPath);
}

let parentDir = path.resolve(`${__dirname}/..`);
let NWCacheFolderPath = path.join(parentDir, 'NW_Cache');
createIfNotExists(NWCacheFolderPath);

let buildVersionParams = NWVersions[versionNumber][SDK ? 'sdk' : 'normal'][platform];
let cacheFileName = buildVersionParams.name;
let NWCacheFilePath = path.join(NWCacheFolderPath, cacheFileName)+'.zip';


const checkForNWCache = async () => {
    const unzipNW = async () => {
        let tempFolderPath = path.join(NWCacheFolderPath, 'NWTemp');
        await decompress(NWCacheFilePath, tempFolderPath);
    
        let internalFolder = path.join(tempFolderPath, cacheFileName)
        let nwFiles = fs.readdirSync(internalFolder, {
            withFileTypes: true
        });
    
        nwFiles.forEach(file => {
            let pathToCopy = path.join(file.path, file.name);
            copyPath(pathToCopy, projectExePath, true)
        })
    }

    // #NWBUILD_DOWNLOAD_OPTIMIZE
    
    let cacheExists = fs.existsSync(NWCacheFilePath)
    
    if(!cacheExists) {
        console.log(`${cacheFileName} is missing, please download the ${cacheFileName}.zip from ${buildVersionParams.url} and put it inside of ${NWCacheFolderPath} then rerun the script!`)
    } else {
        await unzipNW()
    }
} 

const cleanUpTempFiles = () => {
    let settingsJSONpath = `${nwPackagePath}/public/data/settings.json`;
    fs.unlinkSync(settingsJSONpath);
};

const prebuildBinaries = () => {
    const { JSDOM } = require('jsdom');
    // Paths to necessary files and tools
    const indexHtmlFilePath = `${nwPackagePath}/public/index.html`; // Path to your HTML file
    const importerHtmlFilePath = `${nwPackagePath}/public/importer.html`; // Path to your HTML file

    const outputJsFile = path.resolve(`${nwPackagePath}/public/combined.js`); // Combined JS file
    const outputJsFilES5 = path.resolve(`${nwPackagePath}/public/combined-es5.js`); // Combined JS file
    const outputBinFile = path.resolve(`${nwPackagePath}/public/compiled.bin`); // Combined JS file
    const nwjcPath = `${NWCacheFolderPath}/${NWVersions[versionNumber]['sdk'][platform].name}/nwjc.exe` //'path/to/nwjc.exe'; // Path to nwjc.exe
    console.log("NWJC", nwjcPath);

    (async () => {
        try {
            // Step 1: Read and parse the HTML file
            const indexHtmlContent = fs.readFileSync(indexHtmlFilePath, 'utf8');
            const indexDom = new JSDOM(indexHtmlContent);
            const indexDocument = indexDom.window.document;

            const importerHtmlContent = fs.readFileSync(importerHtmlFilePath, 'utf8');
            const importerDom = new JSDOM(importerHtmlContent);
            const importerDocument = importerDom.window.document;

            // Step 2: Extract all JavaScript paths
            const indexElements = Array.from(indexDocument.querySelectorAll('script[src]'));
            let jsPaths = indexElements.map(script => script.src);
            const importerElements = Array.from(importerDocument.querySelectorAll('script[src]'));
            jsPaths = [...importerElements.map(script => script.src), ...jsPaths];

            // Remove the importer.html
            const importerHTMLElement = indexDocument.querySelectorAll("link[rel='import']")[0];
            importerHTMLElement.remove();

            if (jsPaths.length === 0) {
                console.log('No JavaScript files found.');
                return;
            }

            console.log('JavaScript files found:', jsPaths);

            // Step 3: Read and combine all JavaScript files
            let combinedJsContent = '';
            jsPaths.forEach(jsPath => {
                const absolutePath = path.resolve(`${path.dirname(indexHtmlFilePath)}/${jsPath}`);
                console.log(absolutePath);
                if (fs.existsSync(absolutePath)) {
                    combinedJsContent += fs.readFileSync(absolutePath, 'utf8') + '\n';
                } else {
                    console.warn(`Warning: File not found - ${absolutePath}`);
                }
            });

            // Write the combined JavaScript file
            fs.writeFileSync(outputJsFile, combinedJsContent, 'utf8');
            console.log(`Combined JavaScript written to: ${outputJsFile}`);


            // Can't compile bins as they seem to crash the application when loaded, we can at least gather up everything in a single.js
            // child_process.execFileSync(nwjcPath, [outputJsFile, outputBinFile]);

            // Step 5: Modify the HTML file
            indexElements.forEach(script => script.remove()); // Remove all existing <script> tags

            // Add new <script> tag to load the compiled binary
            const newScript = indexDocument.createElement('script');
            newScript.type = 'text/javascript';
            newScript.src = 'combined.js';

            // Can't use .bin as it crashes the application when loaded
            // newScript.text = `nw.Window.get().evalNWBin(undefined, 'public/compiled.bin');`
            indexDocument.body.appendChild(newScript);

            // Write the modified HTML back to the file
            fs.writeFileSync(indexHtmlFilePath, indexDom.serialize(), 'utf8');
            console.log(`Updated HTML written to: ${indexHtmlFilePath}`);

        } catch (error) {
            console.error('An error occurred:', error);
        }
    })();
}

const openFolder = () => {
    child_process.exec(`explorer /select, ${projectExePath}`)
};

(async ()=> {
    cleanUpBuild();
    copyProjectFiles();
    installNPMPackages();
    await checkForNWCache();

    cleanUpTempFiles();
    shouldCompileBinaries && prebuildBinaries()
    openFolder();
})()