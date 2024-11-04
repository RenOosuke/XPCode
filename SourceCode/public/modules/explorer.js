window.sidebarTabs = {
    activeTab: '',
}

const treeChangeEvent = (directoryEl, create) => {
  let parentDir = path.dirname(directoryEl.full_path);
  let directoriesInPath = parentDir.split('\\').length;
  let directoriesInLaunchPath = launchArguments.split('\\').length;
  let level = directoriesInPath - directoriesInLaunchPath;
  let index = directoryEl.index;

  if(index == undefined || index == null || index == -1){
    index = file_explorer.folders[parentDir].children.findIndex(child => child.full_path === directoryEl.full_path)
  }
  // ${level}_${parentDir}
  return new CustomEvent(`tree_changed`, {
    detail: {
      element: directoryEl,
      parentDir,
      index,
      create,
      level
    }
  })
}

window.file_explorer = {
    lastReloaded: new Date(),
    refreshTime: 2000,
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
            resolve({
              name: path.basename(filePath),
              full_path: path.resolve(filePath),
              file_extension: null, // Folders don't have extensions
              isFolder: true,
              children: []
            })
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
      },

    tree: {
      
    },

    folders: {

    },

    currentDirectory: {

    },

    chokidarUpdate: (filePath, isFolder, isCreating) => {
      let details = {
        isFolder,
        name: path.basename(filePath),
        full_path: filePath
      }

      if(isCreating) {

        if(isFolder) {
          details.children = [];
          file_explorer.folders[filePath] = details;
          details.last_sorted = new Date();
        } else {
          details.file_extension = path.extname(filePath);
        }
        
        let parentDir = path.dirname(filePath);

        if(file_explorer.folders[parentDir]) {
          if(new Date() - file_explorer.folders[parentDir].last_sorted >= file_explorer.refreshTime || 500) {
            file_explorer.folders[parentDir].children = file_explorer.sortDirectories([...(file_explorer.folders[parentDir]).children, details]);
            last_sorted = new Date();
          } else {
            file_explorer.folders[parentDir].children = [...(file_explorer.folders[parentDir]).children, details];
          }
        }
      } else {
        if(isFolder) {
          file_explorer.folders[filePath] = undefined;
        }

        let parentDir = path.dirname(filePath);

        let indexOfRemovedElement = file_explorer.folders[parentDir].children.findIndex(child => child.full_path === filePath)
        file_explorer.folders[parentDir].children.splice(indexOfRemovedElement, 1);
        details.index = indexOfRemovedElement;
      }

      let difference = new Date() - file_explorer.lastReloaded; 
      if( difference >= file_explorer.refreshTime) {
        let fileEvent = treeChangeEvent(details, isCreating);
        document.dispatchEvent(fileEvent);
        file_explorer.lastReloaded = new Date();
      } else {
      }
      // file_explorer.folders
    },
    explorerItemMenuConfig: (full_path, evaluator, additionalData) => [
      {
          label: 'Open Preview',
          name: 'open_preview',
          custom: (filePath) => {
              let fileBasename = path.basename(filePath);
              let isAMarkdownFile = fileBasename.includes('.md');
              
              let canPreview = isAMarkdownFile; 

              return canPreview;
          }
      },
      {
          label: "Run Code",
          name: "run_code"
      },
      {
          label: "Open to the Side",
          name: "open_to_the_side"
      },
      {
          label: "Open With...",
          name: "open_with"
      },
      {
          label: "Reveal in File Explorer",
          name: "reveal_in_file_explorer"
      },
      {
          label: "Open in Integrated Terminal",
          name: "open_in_integrated_terminal"
      },
      {
          separator: true
      },
      {
          label: "Select for Compare",
          name: "select_for_compare"
      },
      {
          label: "Find File References",
          name: "find_file_references"
      },
      {
          label: "Open Timeline",
          name: "open_timeline"
      },
      {
          separator: true
      },
      {
          label: "Cut",
          name: "cut"
      },
      {
          label: "Copy",
          name: "copy"
      },
      {
          separator: true
      },
      {
          label: "Copy Path",
          name: "copy_path",
          click: () => {
              fsUtils.copyToClipboard(full_path);
          }
      },
      {
          label: "Copy Relative Path",
          name: "copy_relative_path",
          click: () => {
              fsUtils.copyToClipboard(path.relative(launchArguments, full_path));
          }
      },
      {
          separator: true
      },
      {
          label: "Rename...",
          name: "rename",
          click: () => {
              evaluator(`isStaging`, `!isStaging;`)
          }
      },
      {
          label: "Delete",
          name: "delete", //
          click: () => {
              console.log('Deleting');

              if(additionalData.isFolder) {
                  fs.rmdirSync(full_path);
              } else {
                  fs.unlinkSync(full_path);
              }

              // file_explorer.rescan();
          }
      }
    ],
    selectedItems: [

    ],
    hoveredItem: undefined,

    hoverListeners: 0
  };

  // const watcher = chokidar.watch(launchArguments, {
  //   ignored: /(^|[\/\\])\../, // ignore dotfiles
  //   persistent: true
  // });
  
  
  xp_chokidar.on('Directory created', path => file_explorer.chokidarUpdate(path, true, true))
  xp_chokidar.on('Directory deleted', path => file_explorer.chokidarUpdate(path, true, false));
  // watcher.on('addDir', path => file_explorer.chokidarUpdate(path, true, true));
  // watcher.on('unlinkDir', path => file_explorer.chokidarUpdate(path, true, false));

  xp_chokidar.on('File created', path => file_explorer.chokidarUpdate(path, false, true));
  xp_chokidar.on('File deleted', path => file_explorer.chokidarUpdate(path, false, false));
  // watcher.on('add', path => file_explorer.chokidarUpdate(path, false, true));
  // watcher.on('unlink', path => file_explorer.chokidarUpdate(path, false, false));
  
  xp_chokidar.on('File modified', path => console.log(`File ${path} has been changed`));
  // xp_chokidar.on("Finished logging existing paths",)
  xp_chokidar.watch(launchArguments)

  // watcher.on('change', path => console.log(`File ${path} has been changed`));