<script>
    export let activeTab;

    let labelMapping = {
        'files': 'explorer',
        'search': 'search',
        'git': 'source control',
        'debug': 'run and debug',
    }

    const contextMenuForMoreButton = (singleTabObj) => {

        let _toggle = (subtabName) => {
            let oldValue = singleTabObj[subtabName] //settings.section.get(tabroute)
            singleTabObj[subtabName] = !oldValue;
            settings.update()

            let _customEvent = new CustomEvent("tabsConfigChanged", {
                detail: {
                    tabName: subtabName,
                    value: !oldValue
                },
            })

            document.dispatchEvent(_customEvent);
        }

        return {
            // TODO ARROWS
            /**
             * @type {singleMenuItem[]}
             */
            files: [
                {
                    label: "Open Editors",
                    name: "open_editors",
                    toggled: singleTabObj.open_editors,
                    icon_prefix: true,
                    click: () => {
                        _toggle('open_editors')
                    }
                },
                {
                    label: "Folders",
                    name: "folders",
                    toggled: singleTabObj.folders,
                    icon_prefix: true,
                    click: () => {
                        _toggle('folders')
                    }
                },
                {
                    label: "Outline",
                    name: "outline",
                    toggled: singleTabObj.outline,
                    icon_prefix: true,
                    click: () => {
                        _toggle('outline')
                    }
                },
                {
                    label: "Timeline",
                    name: "timeline",
                    toggled: singleTabObj.timeline,
                    icon_prefix: true,
                    click: () => {
                        _toggle('timeline')
                    }
                },
                {
                    label: "NPM Scripts",
                    name: "npm_scripts",
                    toggled: singleTabObj.npm_scripts,
                    icon_prefix: true,
                    click: () => {
                        _toggle('npm_scripts')
                    }
                }
            ],
            /**
            * @type {singleMenuItem[]}
            */
           // TODO ARROWS
            git: [
                {
                    label: "Views",
                    name: "views",
                    options: [
                        {
                            label: "Source Control Repositories",
                            name: "source_control_repositories"
                        },
                        {
                            label: "Source Control",
                            name: "source_control"
                        },
                        {
                            label: "Source Control Graph",
                            name: "source_control_graph"
                        }
                    ]
                },
                {
                    separator: true
                },
                {
                    label: "View & Sort",
                    name: "view_and_sort",
                    options: [
                        {
                            label: "Repositories",
                            name: "repositories",
                            options: [
                                // TODO 
                                /** LIST OF REPOSITORIES IN THIS WORKSPACE*/
                                {
                                    label: "",
                                    name: ""
                                },
                                {
                                    separator: true
                                },
                                {
                                    label: "Sort by Discovery Time",
                                    name: "sort_by_discovery_time"
                                },
                                {
                                    label: "Sort by Name",
                                    name: "sort_by_name"
                                },
                                {
                                    label: "Sort by Path",
                                    name: "sort_by_path"
                                }
                            ]
                        },
                        {
                            separator: true
                        },
                        {
                            label: "View as List",
                            name: "view_as_list"
                        },
                        {
                            label: "View as Tree",
                            name: "view_as_tree"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Sort Changes by Name",
                            name: "sort_changes_by_name"
                        },
                        {
                            label: "Sort Changes by Path",
                            name: "sort_changes_by_path"
                        },
                        {
                            label: "Sort Changes by Status",
                            name: "sort_changes_by_status"
                        }
                    ]
                },
                {
                    separator: true
                },
                {
                    label: "Pull",
                    name: "pull"
                },
                {
                    label: "Push",
                    name: "push"
                },
                {
                    label: "Clone",
                    name: "clone"
                },
                {
                    label: "Checkout to...",
                    name: "checkout_to"
                },
                {
                    label: "Fetch",
                    name: "fetch"
                },
                {
                    separator: true
                },
                {
                    label: "Commit",
                    name: "commit",
                    options: [
                        {
                            label: "Commit",
                            name: "commit"
                        },
                        {
                            label: "Commit Staged",
                            name: "commit_staged"
                        },
                        {
                            label: "Commit All",
                            name: "commit_all"
                        },
                        {
                            label: "Undo Last Commit",
                            name: "undo_last_commit"
                        },
                        {
                            label: "Abort Rebase",
                            name: "abort_rebase"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Commit (Amend)",
                            name: "commit_amend"
                        },
                        {
                            label: "Commit Staged (Amend)",
                            name: "commit_staged_amend"
                        },
                        {
                            label: "Commit All (Amend)",
                            name: "commit_all_amend"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Commit (Signed Off)",
                            name: "commit_signed_off"
                        },
                        {
                            label: "Commit Staged (Signed Off)",
                            name: "commit_staged_signed_off"
                        },
                        {
                            label: "Commit All (Signed Off)",
                            name: "commit_all_signed_off"
                        }
                    ]
                },
                {
                    label: "Changes",
                    name: "changes",
                    options: [
                        {
                            label: "Stage All Changes",
                            name: "stage_all_changes"
                        },
                        {
                            label: "Unstage All Changes",
                            name: "unstage_all_changes"
                        },
                        {
                            label: "Discard All Changes",
                            name: "discard_all_changes"
                        }
                    ]
                },
                {
                    label: "Pull, Push",
                    name: "pull_push",
                    options: [
                        {
                            label: "Sync",
                            name: "sync"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Pull",
                            name: "pull"
                        },
                        {
                            label: "Pull (Rebase)",
                            name: "pull_rebase"
                        },
                        {
                            label: "Pull from...",
                            name: "pull_from"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Push",
                            name: "push"
                        },
                        {
                            label: "Push to...",
                            name: "push_to"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Fetch",
                            name: "fetch"
                        },
                        {
                            label: "Fetch (Prune)",
                            name: "fetch_prune"
                        },
                        {
                            label: "Fetch From All Remotes",
                            name: "fetch_from_all_remotes"
                        }
                    ]
                },
                {
                    label: "Branch",
                    name: "branch",
                    options: [
                        {
                            label: "Merge Branch...",
                            name: "merge_branch"
                        },
                        {
                            label: "Rebase Branch...",
                            name: "rebase_branch"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Create Branch...",
                            name: "create_branch"
                        },
                        {
                            label: "Create Branch From...",
                            name: "create_branch_from"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Rename Branch...",
                            name: "rename_branch"
                        },
                        {
                            label: "Delete Branch...",
                            name: "delete_branch"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Publish Branch...",
                            name: "publish_branch"
                        }
                    ]
                },
                {
                    label: "Remote",
                    name: "remote",
                    options: [
                        {
                            label: "Add Remote...",
                            name: "add_remote"
                        },
                        {
                            label: "Remove Remote",
                            name: "remove_remote"
                        }
                    ]
                },
                {
                    label: "Stash",
                    name: "stash",
                    options: [
                        {
                            label: "Stash",
                            name: "stash"
                        },
                        {
                            label: "Stash (Include Untracked)",
                            name: "stash_include_untracked"
                        },
                        {
                            label: "Stash Staged",
                            name: "stash_staged"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Apply Latest Stash",
                            name: "apply_latest_stash"
                        },
                        {
                            label: "Apply Stash...",
                            name: "apply_stash"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Pop Latest Stash",
                            name: "pop_latest_stash"
                        },
                        {
                            label: "Pop Stash...",
                            name: "pop_stash"
                        },
                        {
                            separator: true
                        },
                        {
                            label: "Drop Stash...",
                            name: "drop_stash"
                        },
                        {
                            label: "Drop All Stashes...",
                            name: "drop_all_stashes"
                        }
                    ]
                },
                {
                    label: "Tags",
                    name: "tags",
                    options: [
                        {
                            label: "Create Tag",
                            name: "create_tag"
                        },
                        {
                            label: "Delete Tag",
                            name: "delete_tag"
                        },
                        {
                            label: "Delete Remote Tag",
                            name: "delete_remote_tag"
                        }
                    ]
                },
                {
                    separator: true
                },
                {
                    label: "Show Git Output",
                    name: "show_git_output"
                }
            ],
    
            // TODO ARROWS
            /**
            * @type {singleMenuItem[]}
            */
            debug: [
                {
                    label: "Run",
                    name: "run"
                },
                {
                    label: "Breakpoints",
                    name: "breakpoints"
                },
                {
                    separator: true
                },
                {
                    label: "Debug Console",
                    name: "debug_console"
                }
            ]
        }
    }

    let headerColor = 'color: rgb(204, 204, 204);'
    let iconsPath = themeUtils.iconsPath();

    const handleMoreIconClick = (ev) => {
      /** @type {HTMLElement}*/
      let buttonClicked = ev.target;
      let buttonParams = buttonClicked.getBoundingClientRect();

      let clientY = buttonParams.top + buttonParams.height;
      let clientX = buttonParams.left;

        let sectionConfig = settings.section.get(`explorer_tabs.show.${activeTab}`)
        
        let contextMenuConfig = contextMenuForMoreButton(sectionConfig)[activeTab];
        
      menu({
        x: clientX,
        y: clientY,
        shouldBlur: true,
        options: contextMenuConfig
      });
    }
</script>


<div class="explorer_header" id="unselectable" on:selectstart={(e) => e.preventDefault()}>
    <div class="tab_title codicon codicon-view-more" style="{headerColor}">
        {labelMapping[activeTab] || ''}
    </div>

    {#if activeTab !== 'search'}
        <div class="tab_settings">
            <div class="icon-placeholder-more var-icon-hover-bg" on:click={handleMoreIconClick}>
                <div class="header-icon more var-more-icon var-sidebar-inactive-icon" style="-webkit-mask-size: 1rem;"></div>
            </div>
        </div>
    {:else}
    {/if}
</div>


<style>
    .explorer_header {
        padding: .3rem .7rem .3rem 1rem;
        display: flex;
        justify-content: space-between;
        min-height: 1.2rem;
    }

    .tab_title {
        margin-top: .2rem;
        font-size: .7rem;
        text-transform: uppercase;
    }

    .more {
        height: 1rem;
        width: 1rem;
    }

    .icon-placeholder-more {
        padding: .15rem;
        border-radius: .2rem;
    }

    .icon-placeholder-more:hover{
        cursor: pointer;
    }
</style>