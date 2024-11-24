/** explorer.js */

window.sidebarTabs = {
    activeTab: '',
}

let updatesHappened = 0;

const treeChangeEvent = (directoryEl, create) => {
  let parentDir = path.dirname(directoryEl.full_path);
  let directoriesInPath = parentDir.split('\\').length;
  let directoriesInLaunchPath = launchArguments.split('\\').length;
  let level = directoriesInPath - directoriesInLaunchPath;
  let index = directoryEl.index;

  if(directoryEl.full_path !== launchArguments) {
    if(index == undefined || index == null || index == -1){
      index = file_explorer.folders[parentDir].children.findIndex(child => child.full_path === directoryEl.full_path)
    }
    // ${level}_${parentDir}
  
    let foundItem = file_explorer.itemEvents[parentDir];
    
    foundItem && foundItem.childrenRerender({
      element: directoryEl,
      parentDir,
      index,
      create,
      level
    });
  }
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

      updatesHappened++;

      if(isCreating) {
        if(isFolder) {
          details.children = [];
          file_explorer.folders[filePath] = details;
          details.last_sorted = new Date();
        } else {
          details.file_extension = path.extname(filePath);
          file_explorer.allFiles.push(details);
        }
        
        let parentDir = path.dirname(filePath);

        if(file_explorer.folders[parentDir]) {
          if(new Date() - file_explorer.folders[parentDir].last_sorted >= file_explorer.refreshTime || 500) {
            file_explorer.folders[parentDir].children = file_explorer.sortDirectories([...(file_explorer.folders[parentDir]).children, details]);
            file_explorer.folders[parentDir].last_sorted = new Date();

            file_explorer.allFiles = file_explorer.sortDirectories(file_explorer.allFiles);
          } else {
            file_explorer.folders[parentDir].children = [...(file_explorer.folders[parentDir]).children, details];
          }
        }
      } else {
        if(isFolder) {
          file_explorer.folders[filePath] = undefined;
        } else {
          let removingFileIndex = file_explorer.allFiles.findIndex(_file => _file.full_path == filePath);

          file_explorer.allFiles = [
            ...file_explorer.allFiles.slice(0, removingFileIndex),
            ...file_explorer.allFiles.slice(removingFileIndex+1),
          ]
        }
        
        let parentDir = path.dirname(filePath);

        let indexOfRemovedElement = file_explorer.folders[parentDir].children.findIndex(child => child.full_path === filePath)
        file_explorer.folders[parentDir].children.splice(indexOfRemovedElement, 1);
        details.index = indexOfRemovedElement;
      }

      let difference = new Date() - file_explorer.lastReloaded;

      if( true || difference >= file_explorer.refreshTime-1) {
        // let fileEvent = 
        treeChangeEvent(details, isCreating);
        // document.dispatchEvent(fileEvent);
        file_explorer.lastReloaded = new Date();
      }

      if(file_explorer.cutPaths.length>0 && file_explorer.cutPaths.includes(filePath)) {
        file_explorer.cutPaths = file_explorer.cutPaths.filter(a => a != filePath);
        shortcuts.rerenderSelected()
      }
    },
    explorerItemMenuConfig: (full_path, evaluator, additionalData) => {
      return clipboardHelper.sendCommand('check').then(clipboardData => {
        const isPasteEnabled = clipboardData.contentType === 'file' && clipboardData.content.length > 0;

      return [
        {
          label: "New File...",
          name: "new_file",
          click: () => (additionalData.new_file || voidFunction)(),
          custom: () => {
            return additionalData.isFolder
          }
      },
      {
          label: "New Folder...",
          name: "new_folder",
          click: () => (additionalData.new_folder || voidFunction)(),
          custom: () => {
            return additionalData.isFolder
          }
      },
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
          name: "reveal_in_file_explorer",
          click: () => {
            child_process.exec(`explorer /select, ${full_path}`)
          }
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
          name: "cut",
          click: () => {
            let itemsToSelect = file_explorer.selectedItems;

            if(!itemsToSelect.includes(full_path)) {
              itemsToSelect = [full_path]
            }

            clipboardHelper.sendCommand('cut', {
              file_explorer: true,
              files: itemsToSelect
            }).then(a => {

              if(false){
                console.log(a);
              }
            });
          }
      },
      {
          label: "Copy",
          name: "copy",
          click: () => {
            let itemsToSelect = file_explorer.selectedItems;

            if(!itemsToSelect.includes(full_path)) {
              itemsToSelect = [full_path]
            }

            clipboardHelper.sendCommand('copy', {
              file_explorer: true,
              files: itemsToSelect
            }).then(a => {

              if(false){
                console.log(a);
              }
            });
          }
      },
      {
        label: "Paste",
        name: "paste",
        disabled: !isPasteEnabled,
        click: () => {
            let itemsToSelect = [full_path]

            clipboardHelper.sendCommand('paste', {
                file_explorer: true,
                files: itemsToSelect
            }).then(a => {
                  if(false){
                      console.log(a);
                  }
            });
        },
        custom: () => {
          return additionalData.isFolder
        }
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
            file_explorer.contextFunctions.delete({full_path, additionalData});
          }
      }
      ]})
    },
    selectedItems: [

    ],
    hoveredItem: undefined,

    hoverListeners: 0,
    selectedAll: false,
    grayedOut: false,
    staging: {
      oldName: undefined,
      newName: undefined
    },
    cutPaths: [],
    contextFunctions: {
      delete: ({full_path, additionalData}) => {
        console.log(full_path);
        
        if(additionalData.isFolder) {
            fs.rmdirSync(full_path);
        } else {
            fs.unlinkSync(full_path);
        }
      }
    },
    tabSizing: {
      open: [
        
      ],

      rerender: () => {
        file_explorer.tabSizing.open.forEach(tabMeta => {
          themeUtils.setProperty(`--${tabMeta.name}-y-offset`, `${tabMeta.height}px`);
        })
      },

      update: () => {
        let newOpen = jQuery('.explorer-tab').toArray().map((tabEl) => {
          let tabClasses = tabEl.classList
          
          return {
            name: (tabClasses[1]).slice(8),
            height: tabEl.getBoundingClientRect().height,
            open: tabClasses.contains('expanded')
          }
        })

        file_explorer.tabSizing.open = newOpen;
        let fileExplorerEl = jQuery('.explorer-tabs')[0];
      
        file_explorer.tabSizing.maxHeight = fileExplorerEl.getBoundingClientRect().height;
        
        newOpen.forEach((tab) => {
          file_explorer.tabSizing.resize({
            name: tab.name,
            distance: 0,
          })
        })
      },

      resize: (() => {
        const remSize = 16;
        const minTabHeight = 5 * remSize
        
        const resizeTab = (tab, distance) => {
          let heightSumOfRemainder = file_explorer.tabSizing.open.reduce((acc, curTab) => {
            let heightToAdd = curTab.height;

            if(curTab.name == tab.name) {
              heightToAdd = 0;
            };

            return acc + heightToAdd
          }, 0);

          let allowedMaxHeight = file_explorer.tabSizing.maxHeight - heightSumOfRemainder;

          tab.height -= distance;
          tab.height = Math.max(tab.height, minTabHeight)
          tab.height = Math.min(tab.height, allowedMaxHeight)
        }

        const calculateSafeDistance = (tab, distance) => {
          let safeDistance = distance;

          if(tab.height - distance < minTabHeight) {
            safeDistance = tab.height - minTabHeight;
          }

          return safeDistance;
        }

        return (tabEvent) => {

          let tabsConfig = file_explorer.tabSizing.open;
          
          let tabName = tabEvent.name;
          let tabIndex = file_explorer.tabSizing.tabIndexes[tabName];
          let currentTabMeta = tabsConfig[tabIndex];

          let openedTabsAbove = tabsConfig.filter((upperTab, upperTabIndex) => {
            return upperTabIndex < tabIndex && upperTab.open
          }).map(upperTab => file_explorer.tabSizing.tabIndexes[upperTab.name]);

          let idexOfFirstOpenTabAbove = openedTabsAbove[openedTabsAbove.length-1];
          
          let upperTab = tabsConfig[idexOfFirstOpenTabAbove];
          
          if(upperTab) {
            let distance = tabEvent.distance;
            let safeDistance = distance
            
            if(currentTabMeta.open) {

              safeDistance = calculateSafeDistance(currentTabMeta, safeDistance);
              safeDistance = -1 * calculateSafeDistance(upperTab, safeDistance * -1)

              resizeTab(upperTab, safeDistance * -1);
              resizeTab(currentTabMeta, safeDistance);

              file_explorer.tabSizing.rerender();
              
            } else {
              let lowerOpenedTab = tabsConfig.find((tabMeta, index) => {
                return tabMeta.open && index > tabIndex;
              });
              
              if(lowerOpenedTab) {
                safeDistance = calculateSafeDistance(lowerOpenedTab, safeDistance);
                safeDistance = -1 * calculateSafeDistance(upperTab, safeDistance * -1)
  
                resizeTab(upperTab, safeDistance * -1);
                resizeTab(lowerOpenedTab, safeDistance);
                file_explorer.tabSizing.rerender();
              }
            }
          }
        }
      })(),

      tabIndexes: {
        'opne_editors': 0,
        'folders': 1,
        'outline': 2,
        'timeline': 3,
        'npm_scripts': 4
      },

      maxHeight: 0
    },
    itemEvents: {},
    allFiles: [],
    recentlyOpened: (() => {
      let _files = [];

      return {
        get: () => _files,
        removeDublicates: () => {
          _files = Array.from(new Set(_files))
        },
        push: (..._arguments) => {
          _files.push(..._arguments)
        },
        unshift: (...arguments) => {
          _files.unshift(...arguments);
        },
        remove: (file) => {
          let fileIndex = _files.findIndex(_file => _file == file);
          _files = [
            ..._files.slice(0, fileIndex),
            ..._files.slice(fileIndex+1)
          ]
        }
      }
    })(),
    
    openItem: (full_path) => {
      file_explorer.recentlyOpened.unshift(full_path);
      file_explorer.recentlyOpened.removeDublicates();
      file_explorer.activeItem = full_path;
      
      document.dispatchEvent(new CustomEvent(ACTIVE_ELEMENT_CHANGED));
    },
    activeItem: undefined
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