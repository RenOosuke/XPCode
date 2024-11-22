<script>
  import { onMount } from "svelte";
  export let hide;

    let files = [];
    let showAllFiles = false;
    let selectedIndex = 0;
    let searchValue = '';

    let allFiles = [];
    let recentFiles = [];
    
    let filteredAllFiles = [];
    let filteredRecentFiles = [];
    let recentFilesLength = 0;

    let showLine = true;
    let cloneArr = (arr) => {
        return JSON.parse(JSON.stringify(arr));
    }

    let noMatchingResults = false;

    const handleSearchChange = (ev) => {
        console.log(filteredAllFiles, filteredRecentFiles)
        if(searchValue.length > 0) {
            console.log('Should rerender letter coloring', searchValue);
            showAllFiles = true;
            // filteredRecentFiles = 
            filteredRecentFiles = cloneArr(recentFiles).map(recentFile => {
                let passesByName = containsSubsequenceWithIndices(recentFile.name, searchValue);

                if(passesByName.contains) {
                    recentFile.nameContains = true;
                    recentFile.name = highlightRanges(recentFile.name ,passesByName.indices) ;
                };

                if(recentFile.relative_path) {
                    let passesByPath = containsSubsequenceWithIndices(recentFile.relative_path, searchValue);
                    
                    if(passesByPath.contains) {
                        recentFile.pathContains = true;
                        recentFile.relative_path = highlightRanges(recentFile.relative_path ,passesByPath.indices) ;
                    };
                }

                return recentFile;
            }).filter(recentFile => (recentFile.pathContains) || (recentFile.nameContains))

            filteredAllFiles = cloneArr(allFiles).map(allFile => {
                let passesByName = containsSubsequenceWithIndices(allFile.name, searchValue);

                if(passesByName.contains) {
                    allFile.nameContains = true;
                    allFile.name = highlightRanges(allFile.name ,passesByName.indices) ;
                };


                if(allFile.relative_path) {
                    let passesByPath = containsSubsequenceWithIndices(allFile.relative_path, searchValue);
                    
                    if(passesByPath.contains) {
                        allFile.pathContains = true;
                        allFile.relative_path = highlightRanges(allFile.relative_path ,passesByPath.indices) ;
                    };
                }

                console.log(allFile);
                return allFile;
            }).filter(allFile => (allFile.pathContains) || (allFile.nameContains))

            if(filteredRecentFiles.length + filteredAllFiles.length == 0) {
                noMatchingResults = true
            } else {
                noMatchingResults = false
            }

        } else {
            showAllFiles = false
            noMatchingResults = false;
            filteredRecentFiles = cloneArr(recentFiles);
            filteredAllFiles = [];
        }

        selectedIndex = 0
    } 

    function containsSubsequenceWithIndices(str, subseq) {
        let i = 0, j = 0;
        let indices = [];
        let start = -1;

        while (i < str.length && j < subseq.length) {
            if (str[i] === subseq[j]) {
                if (start === -1) start = i; // Mark the start of the matching substring
                j++; // Move to the next character in subseq
            } else if (start !== -1) {
                // If we are breaking a match, save the range
                indices.push([start, i]);
                start = -1; // Reset start
            }
            i++; // Always move to the next character in str
        }

        // Handle the case where the last match goes to the end of the string
        if (start !== -1) {
            indices.push([start, i]);
        }

        // Verify that all remaining characters in subseq have matching counterparts in str after the last match
        while (j < subseq.length) {
            i = str.indexOf(subseq[j], i); // Search for the next character in str
            if (i === -1) {
                // If any character in subseq is not found, return false
                return { contains: false, indices: [] };
            }
            j++;
        }

        return {
            contains: indices.length > 0,
            indices: indices,
        };
    }

    function highlightRanges(str, ranges) {
        let highlighted = "";
        let lastIndex = 0;

        for (const [start, end] of ranges) {
            // Append the part of the string before the range
            highlighted += str.slice(lastIndex, start);
            // Append the highlighted part of the string
            highlighted += `<blue>${str.slice(start, end)}</blue>`;
            // Update the last index to the end of the current range
            lastIndex = end;
        }

        // Append any remaining part of the string after the last range
        highlighted += str.slice(lastIndex);

        return highlighted;
    }

    const contextMenuPasstrough =  (ev) => {
            ev.preventDefault();
            hide();

            let otherClickedEl = document.elementFromPoint(ev.clientX, ev.clientY);
            const newEvent = new MouseEvent("contextmenu", {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: ev.clientX,
                clientY: ev.clientY,
                button: 2,
            });

            if (otherClickedEl) {
                otherClickedEl.dispatchEvent(newEvent);
            }
    };

    const fileSearchBlur = (ev) => {
        if(ev.target.classList.contains('context-menu-shadow')) {
            endSearching();
        }
    }

    const endSearching = () => {
        document.removeEventListener("contextmenu", contextMenuPasstrough)
        document.removeEventListener("click", fileSearchBlur)
        document.removeEventListener("keydown", listenForArrowKeys)
        hide();
    }

    const listenForArrowKeys = (ev) => {
        if(ev.key == "ArrowDown") {
            let maxLength = filteredAllFiles.length + filteredRecentFiles.length;
            selectedIndex = Math.min(maxLength-1, selectedIndex+1);
        }

        if(ev.key == "ArrowUp") {
            let minIndex = 0;
            selectedIndex = Math.max(minIndex, selectedIndex-1);
        }

        if(ev.key == "Escape") {
            endSearching();
        }

        if(ev.key == "Enter") {
            let combinedArr = [...filteredAllFiles, ...filteredRecentFiles];

            if(selectedIndex < combinedArr.length) {
                let selectedFile = combinedArr[selectedIndex];
                handleRowClick({}, selectedFile);
            }
        }
    };
    
    const getAbsolutePath = (file) => {
        let fileName = file.name;
        let relativePath = file.relative_path;
        let relativeName = path.join(launchArguments, (relativePath || ''), fileName);
        let absolutePath = path.resolve(relativeName);
        absolutePath = absolutePath.replace(/<\\?blue>/g, '');

        return absolutePath;
    }
    const handleRecentsRemove = (ev, file) => {
        console.log(ev, file);
        
        ev.stopPropagation();
        ev.preventDefault();
        
        let absolutePath = getAbsolutePath(file);
        file_explorer.recentlyOpened.remove(absolutePath);
        
        let indexInTotalRecentFiles = recentFiles.findIndex(recentFile => recentFile.relative_path == relativePath && recentFile.name == fileName);

        recentFiles = [
            ...recentFiles.slice(0, indexInTotalRecentFiles),
            ...recentFiles.slice(indexInTotalRecentFiles+1)
        ]

        let indexInFilteredRecentFiles = filteredRecentFiles.findIndex(recentFile => recentFile.relative_path == relativePath && recentFile.name == fileName);

        filteredRecentFiles = [
            ...filteredRecentFiles.slice(0, indexInFilteredRecentFiles),
            ...filteredRecentFiles.slice(indexInFilteredRecentFiles + 1),
        ]
    }

    const handleRowClick = (ev, file) => {
        alert("Opening of files isnt implemented yet!");
        endSearching();
        let absolutePath = getAbsolutePath(file);
        console.log(absolutePath);
        file_explorer.recentlyOpened.unshift(absolutePath)
    }

    onMount(() => {
        alert("Stuff to implement here: \n 1) unsaved files showing \n 2) opening of files \n 3) open file in split view");

        let shadow = jQuery(".context-menu-shadow")[0];
        
        shadow.addEventListener("contextmenu", contextMenuPasstrough);

        shadow.addEventListener("click", fileSearchBlur);

        let recent_files = file_explorer.recentlyOpened.get(); 
        recentFiles = recent_files.map(_file => {
            let relative_path = path.relative(launchArguments, _file);
            let dataToReturn = 
            {
                icon: iconManager.getIconForPath(_file),
                name: path.basename(_file),
            }

            if(relative_path != dataToReturn.name) {
                dataToReturn.relative_path = path.dirname(relative_path);
            }

            return dataToReturn
        });

        filteredRecentFiles = recentFiles;
        recentFilesLength = filteredRecentFiles.length;

        allFiles = file_explorer.allFiles.map((_file) => {
            let relative_path = path.relative(launchArguments, _file.full_path);
            let dataToReturn = 
            {
                icon: iconManager.getIconForPath(_file.full_path),
                name: path.basename(_file.full_path),
            }

            if(relative_path != dataToReturn.name) {
                dataToReturn.relative_path = relative_path;
            }

            return dataToReturn
        });

        filteredAllFiles = allFiles;
        
        // recentFiles = 
        let searchBox = jQuery('.file_search_box')[0];
        searchBox.focus();

        document.addEventListener('keydown', listenForArrowKeys);
  });
</script>

<div class="context-menu-shadow" id="unselectable">
    <div class="file_search_window">
        <input class="file_search_box" placeholder="Search files by name (append : to go to line or @ to go to symbol)" bind:value={searchValue} on:input={handleSearchChange}/>

        <div class="files_scrollable_area">


            <div class="recent_files">
                {#each filteredRecentFiles as file, recentFileIndex}
                    <div class="single_file_row {selectedIndex == recentFileIndex ? 'selected' : ''}" on:click={(ev) => handleRowClick(ev, file)}>
                        <div class="left_side">
                            <div class="file_icon_placeholder {file.icon}"></div>
                            <div class="file_name">{@html file.name}</div>
                            
                            {#if file.relative_path}
                                <div class="relative_path">{@html file.relative_path}</div>
                            {/if}
                        </div>
    
                        <div class="right_side">
                            <div class="button_placeholder">
                                <button class="side_view" style="-webkit-mask: var(--split-horizontal-icon);-webkit-mask-size: 1rem;"></button>
                            </div>
    
                            <div class="button_placeholder" on:click={(ev) => handleRecentsRemove(ev, file)}>
                                <button class="remove"style="-webkit-mask: var(--close-icon);-webkit-mask-size: 1rem;"></button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            {#if recentFilesLength > 0 && showAllFiles}
                <div class="splitting-line">

                </div>
            {/if}

            <div class="all_files">
                {#if showAllFiles}
                    {#each filteredAllFiles as file, filteredFilesIndex}
                        <div class="single_file_row {selectedIndex == filteredFilesIndex + recentFilesLength ? 'selected' : ''}"  on:click={(ev) => handleRowClick(ev, file)}>
                            <div class="left_side">
                                <div class="file_icon_placeholder {file.icon}"></div>
                                <div class="file_name">{@html file.name}</div>
                                
                                {#if file.relative_path}
                                    <div class="relative_path">{@html file.relative_path}</div>
                                {/if}
                            </div>
    
                            <div class="right_side">
                                <div class="button_placeholder">
                                    <button class="side_view" style="-webkit-mask: var(--split-horizontal-icon);-webkit-mask-size: 1rem;"></button>
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>

            {#if noMatchingResults}
                <div class="no_matching_results">
                    No matching results
                </div>                
            {/if}
        </div>
    </div>
</div>

<style>
  .context-menu-shadow {
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 50;
    display: flex;
    justify-content: center;
  }

  .file_search_window {
    padding: .5rem .7rem .5rem .4rem;
    box-shadow: rgba(0, 0, 0, 0.36) 0px 0px 8px 2px;
    border-radius: .3rem;
    border: solid 1px var(--directory-rename-bg);
    background-color: var(--file-search-bg);
    width: 20%;
    min-width: 30rem;
    margin-top: .5rem;
    height: fit-content;
  }

  .files_scrollable_area {
    max-height: 45vh;
  }

  /* .single_file_row:first {
    margin-top: .15rem;
  } */

  .file_search_box {
    outline: none;
    border: solid 1px var(--outline-color); 
    background-color: var(--directory-rename-bg);
    height: 1.5rem;
    width: 100%;
    color: var(--base-text-color);
    font-size: .85rem;
    margin-bottom: .25rem;
  }


  .single_file_row {
    display: flex;
    justify-content: space-between;
    border-radius: .2rem;
  }

  .single_file_row:hover {
    background-color: var(--file-search-hover-bg);
    cursor: pointer;
  }

  .single_file_row:hover .button_placeholder {
    display: flex;
  }

  .left_side {
    display: flex;
    margin-left: .5rem;
  }

  .file_icon_placeholder::before {
        font-family: "Seti_Icon";
        background-image: unset;
        font-size: 130%;
        width: 1.2rem;
        padding-top: .15rem;
    }

    .file_icon_placeholder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 0.4rem;
    }

    .file_name {
        color: var(--base-text-color);
        line-height: 1.2;
        font-size: 0.8rem;
        /* display: flex; */
        flex-direction: column;
        justify-content: center;
        /* padding-bottom: 0.05rem; */
        margin-top: auto;
        margin-bottom: auto;
    }

    .relative_path {
        margin-left: .6rem;
        color: var(--file-search-subtext-color);
        font-size: .75rem;
        margin-top: auto;
        margin-bottom: auto;
    }

  .right_side {
    display: flex;
  }

  .button_placeholder {
    height: 1.1rem;
    width: 1.1rem;
    margin-right: .35rem;
    padding: .1rem;
    display: none;
    flex-direction: column;
    justify-content: center;
    font-size: .65rem;
    border-radius: .2rem;
    margin-top: auto;
    margin-bottom: auto;
  }

  .button_placeholder button {
    font-size: 1.2rem;
    margin-top: auto;
    margin-bottom: auto;
  }

  .button_placeholder:hover {
    background-color: rgba(255, 255, 255, 0.071);
  }

  .splitting-line {
    width: 100%;
    height: 1px;
    background-color: var(--directory-rename-bg);
  }

  .single_file_row.selected {
    background-color: var(--item-select-bg);
  }

  .single_file_row.selected .button_placeholder {
    display: flex;
  }

  .no_matching_results {
    background-color: var(--item-select-bg);
    color: var(--base-text-color);
    border-radius: .2rem;
    cursor: pointer;
    font-size: .85rem;
    padding-left: .5rem;
    height: 1.3rem;
    padding-bottom: .1rem;
    padding-top: .1rem;
  }
</style>