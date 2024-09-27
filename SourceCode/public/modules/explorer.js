window.sidebarTabs = {
    activeTab: '',
}

window.file_explorer = {
    // Recursive function to get files and directories, with nested folders having "children"
    getFilesInDirectory: function (dirPath) {
      return new Promise((resolve, reject) => {
        fs.stat(dirPath, (err, stats) => {
          if (err) return reject(err);
  
          if (stats.isFile()) {
            // If it's a file, return just that file in the array
            resolve([{
              name: path.basename(dirPath),
              full_path: path.resolve(dirPath),
              file_extension: path.extname(dirPath) || null,
              isFolder: false,
              mtime: stats.mtime
            }]);
          } else if (stats.isDirectory()) {
            // If it's a directory, process the files/folders inside recursively
            fs.readdir(dirPath, (err, files) => {
              if (err) return reject(err);
  
              // Use a promise to resolve all file stats
              const promises = files.map((file) => {
                const fullPath = path.join(dirPath, file);
                return window.file_explorer.getFileDetails(fullPath); // Recursive call
              });
  
              Promise.all(promises)
                .then(children => {
                  resolve([{
                    name: path.basename(dirPath),
                    full_path: path.resolve(dirPath),
                    file_extension: null, // Directories don't have extensions
                    isFolder: true,
                    children: children, // Recursively fetched child files/folders
                  }]);
                })
                .catch(err => reject(err));
            });
          } else {
            reject(new Error("Path is neither a file nor a directory"));
          }
        });
      });
    },
  
    // Helper function to get the details of a single file or folder
    getFileDetails: function (filePath) {
      return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
          if (err) return reject(err);
  
          if (stats.isFile()) {
            resolve({
              name: path.basename(filePath),
              full_path: path.resolve(filePath),
              file_extension: path.extname(filePath) || null,
              isFolder: false
            });
          } else if (stats.isDirectory()) {
            // Recursive call to get the folder's children
            window.file_explorer.getFilesInDirectory(filePath)
              .then((children) => {
                resolve({
                  name: path.basename(filePath),
                  full_path: path.resolve(filePath),
                  file_extension: null, // Folders don't have extensions
                  isFolder: true,
                  children: children[0].children || [] // Add its children recursively
                });
              })
              .catch(err => reject(err));
          }
        });
      });
    },

    sortDirectories: function(_directoriesList) {
        let directoriesList = [..._directoriesList];
        // console.log(directoriesList);

        // const basicComparison = (a, b) => {

        //       if (a < b) {
        //         return -1;
        //       }

        //       if (a > b) {
        //         return 1;
        //       }

        //       return 0;
        // }

        return directoriesList.sort(VSCode.original.comparer.compare)
    },

    getFileExtension(filePath) {
        const parts = filePath.split('.');
        if (parts.length > 1) {
          return parts.slice(1).join('.'); // return the last part (the extension)
        }
        return null;
      }
  };