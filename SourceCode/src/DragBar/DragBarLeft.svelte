<script>
  import { R } from "../../src-noconflict/ace";

  const dragbarContextMenus =  [
    {
      label: "File",
      name: "file",
    },
    {
      label: "Edit",
      name: "edit",
    },
    {
      label: "Selection",
      name: "selection",
    },
    {
      label: "View",
      name: "view",
    },
    {
      label: "Go",
      name: "go",
    },
    {
      label: "Run",
      name: "run",
    },
    {
      label: "Terminal",
      name: "terminal",
    },
    {
      label: "Help",
      name: "help",
    },
  ];

  const menusByTab =() => {
    /**
     * @type {{[any]: singleMenuItem[]}}
     */
    let config = {
    /**
     * @type {singleMenuItem[]}
     */
    file: [
      {
        label: "New Text File",
        name: "new_text_file",
      },
      {
        label: "New File...",
        name: "new_file",
      },
      {
        label: "New Window",
        name: "new_window",
      },
      {
        separator: true,
      },
      {
        label: "Open File...",
        name: "open_file",
      },
      {
        label: "Open Folder...",
        name: "open_folder",
      },
      {
        label: "Open Workspace from File...",
        name: "open_workspace_from_file",
      },
      {
        label: "Open Recent",
        name: "open_recent",
        options: [
          {
            label: "Reopen Closed Editor",
            name: "reopen_closed_editor",
          },
          {
            separator: true,
          },
          {}
          ,
          // TODO
          /** INSERT TABS WITH PREVIOUSLY OPENED DIRECTORIES HERE*/ {
            separator: true,
          },
          {}
          ,
          // TODO
          /** INSERT TABS WITH PREVIOUSLY OPENED FILES HERE*/ {
            separator: true,
          },
          {
            label: "More...",
            name: "more",
          },
          {
            label: "Clear Recently Opened",
            name: "clear_recently_opened",
          },
        ],
      },
      {
        label: "Add Folder to Workspace...",
        name: "add_folder_to_workspace",
      },
      {
        label: "Save Workspace As...",
        name: "save_workspace_as",
      },
      {
        label: "Duplicate Workspace",
        name: "duplicate_workspace",
      },
      {
        separator: true,
      },
      {
        label: "Save",
        name: "save",
      },
      {
        label: "Save As...",
        name: "save_as",
      },
      {
        label: "Save All",
        name: "save_all",
        disabled: true,
      },
      {
        separator: true,
      },
      {
        label: "Auto Save",
        name: "auto_save",
      },
      {
        label: "Preferences",
        name: "preferences",
        options: [
          ...settings.contextMenu.preferences(),
        ],
      },
      {
        separator: true,
      },
      {
        label: "Revert File",
        name: "revert_file",
      },
      {
        label: "Close Editor",
        name: "close_editor",
      },
      {
        label: "Close Folder",
        name: "close_folder",
      },
      {
        label: "Close Window",
        name: "close_window",
      },
      {
        separator: true,
      },
      {
        label: "Exit",
        name: "exit",
      },
    ],

    /**
     * @type {singleMenuItem[]}
     */
    edit: [
      {
        label: "Undo",
        name: "undo",
      },
      {
        label: "Redo",
        name: "redo",
      },
      {
        separator: true,
      },
      {
        label: "Cut",
        name: "cut",
      },
      {
        label: "Copy",
        name: "copy",
      },
      {
        label: "Paste",
        name: "paste",
      },
      {
        separator: true,
      },
      {
        label: "Find",
        name: "find",
      },
      {
        label: "Replace",
        name: "replace",
      },
      {
        separator: true,
      },
      {
        label: "Find in Files",
        name: "find_in_files",
      },
      {
        label: "Replace in Files",
        name: "replace_in_files",
      },
      {
        separator: true,
      },
      {
        label: "Toggle Line Comment",
        name: "toggle_line_comment",
      },
      {
        label: "Toggle Block Comment",
        name: "toggle_block_comment",
      },
      {
        label: "Emmet: Expand Abbreviation",
        name: "emmet_expand_abbreviation",
      },
    ],

    /**
     * @type {singleMenuItem[]}
     */
    selection: [
      {
        label: "Select All",
        name: "select_all",
      },
      {
        label: "Expand Selection",
        name: "expand_selection",
      },
      {
        label: "Shrink Selection",
        name: "shrink_selection",
      },
      {
        separator: true,
      },
      {
        label: "Copy Line Up",
        name: "copy_line_up",
      },
      {
        label: "Copy Line Down",
        name: "copy_line_down",
      },
      {
        label: "Move Line Up",
        name: "move_line_up",
      },
      {
        label: "Move Line Down",
        name: "move_line_down",
      },
      {
        label: "Duplicate Selection",
        name: "duplicate_selection",
      },
      {
        separator: true,
      },
      {
        label: "Add Cursor Above",
        name: "add_cursor_above",
      },
      {
        label: "Add Cursor Below",
        name: "add_cursor_below",
      },
      {
        label: "Add Cursor to Line Ends",
        name: "add_cursor_to_line_ends",
      },
      {
        label: "Add Next Occurrence",
        name: "add_next_occurrence",
      },
      {
        label: "Add Previous Occurrence",
        name: "add_previous_occurrence",
      },
      {
        label: "Select All Occurrences",
        name: "select_all_occurrences",
      },
      {
        separator: true,
      },
      {
        label: "Switch to Ctrl+Click for Multi-Cursor",
        name: "switch_to_ctrlclick",
      },
      {
        label: "Column Selection Mode",
        name: "column_selection_mode",
      },
    ],

    /**
     * @type {singleMenuItem[]}
     */
    view: [
      {
        label: "Command Palette",
        name: "command_palette",
      },
      {
        label: "Open View...",
        name: "open_view",
      },
      {
        separator: true,
      },
      {
        label: "Appearance",
        name: "appearance",
        options: [
          {
            label: "Full Screen",
            name: "full_screen",
          },
          {
            label: "Zen Mode",
            name: "zen_mode",
          },
          {
            label: "Centered Layout",
            name: "centered_layout",
          },
          {
            separator: true,
          },

          // TODO
          /** IMPLEMENT TOGGLING FOR THESE MENU ITEMS */
          {
            label: "Menu Bar",
            name: "menu_bar",
          },
          {
            label: "Primary Side Bar",
            name: "primary_side_bar",
          },
          {
            label: "Secondary Side Bar",
            name: "secondary_side_bar",
          },
          {
            label: "Status Bar",
            name: "status_bar",
          },
          {
            label: "Activity Bar",
            name: "activity_bar",
          },
          {
            label: "Panel",
            name: "panel",
          },
          {
            separator: true,
          },
          {
            label: "Move Primary Side Bar Right",
            name: "move_primary_side_bar_right",
          },
          {
            label: "Panel Position",
            name: "panel_position",
            options: [
              {
                label: "Bottom",
                name: "Bottom",
              },
              {
                label: "Left",
                name: "left",
              },
              {
                label: "Right",
                name: "right",
              },
            ],
          },
          {
            label: "Align Panel",
            name: "align_panel",
            options: [
              {
                label: "Center",
                name: "center",
              },
              {
                label: "Justify",
                name: "justify",
              },
              {
                label: "Left",
                name: "left",
              },
              {
                label: "Right",
                name: "right",
              },
            ],
          },
          {
            separator: true,
          },
          // TODO
          /** IMPLEMENT TOGGLING FOR THESE MENU ITEMS */
          {
            label: "Minimap",
            name: "minimap",
          },
          {
            label: "Breadcrumbs",
            name: "breadcrumbs",
          },
          {
            label: "Sticky Scroll",
            name: "sticky_scroll",
          },
          {
            label: "Render Whitespace",
            name: "render_whitespace",
          },
          {
            label: "Render Control Characters",
            name: "render_control_characters",
          },
          {
            separator: true,
          },
          {
            label: "Zoom In",
            name: "zoom_in",
          },
          {
            label: "Zoom Out",
            name: "zoom_out",
          },
          {
            label: "Reset Zoom",
            name: "reset_zoom",
          },
        ],
      },
      {
        label: "Editor Layout",
        name: "editor_layout",
        options: [
          {
            label: "Split Up",
            name: "split_up",
          },
          {
            label: "Split Down",
            name: "split_down",
          },
          {
            label: "Split Left",
            name: "split_left",
          },
          {
            label: "Split Right",
            name: "split_right",
          },
          {
            separator: true,
          },
          {
            label: "Split In Groups",
            name: "split_in_groups",
          },
          {
            separator: true,
          },
          {
            label: "Single",
            name: "single",
          },
          {
            label: "Two Columns",
            name: "two_columns",
          },
          {
            label: "Three Columns",
            name: "three_columns",
          },
          {
            label: "Two Rows",
            name: "two_rows",
          },
          {
            label: "Three Rows",
            name: "three_rows",
          },
          {
            label: "Grid (2x2)",
            name: "grid_2by2",
          },
          {
            label: "Two Rows Right",
            name: "two_rows_right",
          },
          {
            label: "Two Columns Bottom",
            name: "two_columns_bottom",
          },
          {
            separator: true,
          },
          {
            label: "Flip Layout",
            name: "flip_layout",
          },
        ],
      },
      {
        separator: true,
      },
      {
        label: "Explorer",
        name: "explorer",
      },
      {
        label: "Search",
        name: "search",
      },
      {
        label: "Source Control",
        name: "source_control",
      },
      {
        label: "Run",
        name: "run",
      },
      {
        label: "Extensions",
        name: "extensions",
      },
      {
        separator: true,
      },
      {
        label: "Problems",
        name: "problems",
      },
      {
        label: "Output",
        name: "output",
      },
      {
        label: "Debug Console",
        name: "debug_console",
      },
      {
        label: "Terminal",
        name: "terminal",
      },
      {
        separator: true,
      },
      {
        label: "Word Wrap",
        name: "word_wrap",
      },
    ],

    /**
     * @type {singleMenuItem[]}
     */
        go: [
        {
            label: "Back",
            name: "back",
      },
      {
        label: "Forward",
        name: "forward",
      },
      {
        label: "Last Edit Location",
        name: "last_edit_location",
      },
      {
        separator: true,
      },
      {
        label: "Switch Editor",
        name: "switch_editor",
        options: [
                    {
                        label: "Next Editor",
                        name: "next_editor"
                    },
                    {
                        label: "Previous Editor",
                        name: "previous_editor"
                    },
                    {
                        separator: true
                    },
                    {
                        label: "Next Used Editor",
                        name: "next_used_editor"
                    },
                    {
                        label: "Previous Used Editor",
                        name: "previous_used_editor"
                    },
                    {
                        separator: true
                    },
                    {
                        label: "Next Editor in Group",
                        name: "next_editor_in_group"
                    },
                    {
                        label: "Previous Editor in Group",
                        name: "previous_editor_in_group"
                    },
                    {
                        separator: true
                    },
                    {
                        label: "Next Used Editor in Group",
                        name: "next_used_editor_in_group"
                    },
                    {
                        label: "Previous Used Editor in Group",
                        name: "previous_used_editor_in_group"
                    }
        ]
      },
      {
        label: "Switch Group",
        name: "switch_group",
        options: [
                {
                    label: "Group 1",
                    name: "group_1"
                },
                {
                    label: "Group 2",
                    name: "group_2"
                },
                {
                    label: "Group 3",
                    name: "group_3"
                },
                {
                    label: "Group 4",
                    name: "group_4"
                },
                {
                    label: "Group 5",
                    name: "group_5"
                },
                {
                    separator: true
                },
                {
                    label: "Next Group",
                    name: "next_group"
                },
                {
                    label: "Previous Group",
                    name: "previous_group"
                },
                {
                    separator: true
                },
                {
                    label: "Group Left",
                    name: "group_left"
                },
                {
                    label: "Group Right",
                    name: "group_right"
                },
                {
                    label: "Group Above",
                    name: "group_above"
                },
                {
                    label: "Group Below",
                    name: "group_below"
                }
        ]
      },
      {
        label: "Go to File...",
        name: "go_to_file",
      },
      {
        label: "Go to Symbol in Workspace...",
        name: "go_to_symbol_in_workspace",
      },
      {
        separator: true,
      },
      {
        label: "Go to Symbol in Editor...",
        name: "go_to_symbol_in_editor",
      },
      {
        label: "Go to Definition",
        name: "go_to_definition",
      },
      {
        label: "Go to Declaration",
        name: "go_to_declaration",
      },
      {
        label: "Go to Type Definition",
        name: "go_to_type_definition",
      },
      {
        label: "Go to Implementations",
        name: "go_to_implementations",
      },
      {
        label: "Go to References",
        name: "go_to_references",
      },
      {
        separator: true,
      },
      {
        label: "Go to Line/Column...",
        name: "go_to_line_column",
      },
      {
        label: "Go to Bracket",
        name: "go_to_bracket",
      },
      {
        separator: true,
      },
      {
        label: "Next Problem",
        name: "next_problem",
      },
      {
        label: "Previous Problem",
        name: "previous_problem",
      },
      {
        separator: true,
      },
      {
        label: "Next Change",
        name: "next_change",
      },
      {
        label: "Previous Change",
        name: "previous_change",
      },
    ],

    /**
     * @type {singleMenuItem[]}
     */

      run: [
        {
            label: "Start Debugging",
            name: "start_debugging"
        },
        {
            label: "Run Without Debugging",
            name: "run_without_debugging"
        },
        {
            label: "Stop Debugging",
            name: "stop_debugging"
        },
        {
            label: "Restart Debugging",
            name: "restart_debugging"
        },
        {
            separator: true
        },
        {
            label: "Open Configurations",
            name: "open_configurations"
        },
        {
            label: "Add Configuration...",
            name: "add_configuration"
        },
        {
            separator: true
        },
        {
            label: "Step Over",
            name: "step_over"
        },
        {
            label: "Step Into",
            name: "step_into"
        },
        {
            label: "Step Out",
            name: "step_out"
        },
        {
            label: "Continue",
            name: "continue"
        },
        {
            separator: true
        },
        {
            label: "Toggle Breakpoint",
            name: "toggle_breakpoint"
        },
        {
            label: "New Breakpoint",
            name: "new_breakpoint",
            options: [
                {
                    label: "Conditional Breakpoint...",
                    name: "conditional_breakpoint"
                },
                {
                    label: "Edit Breakpoint",
                    name: "edit_breakpoint"
                },
                {
                    label: "Inline Breakpoint",
                    name: "inline_breakpoint"
                },
                {
                    label: "Function Breakpoint...",
                    name: "function_breakpoint"
                },
                {
                    label: "Logpoint...",
                    name: "logpoint"
                }
            ]
        },
        {
            separator: true
        },
        {
            label: "Enable All Breakpoints",
            name: "enable_all_breakpoints"
        },
        {
            label: "Disable All Breakpoints",
            name: "disable_all_breakpoints"
        },
        {
            label: "Remove All Breakpoints",
            name: "remove_all_breakpoints"
        },
        {
            separator: true
        },
        {
            label: "Install Additional Debuggers...",
            name: "install_additional_debuggers"
        }
    ],

    /**
     * @type {singleMenuItem[]}
     */
    terminal: [
        {
            label: "New Terminal",
            name: "new_terminal"
        },
        {
            label: "Split Terminal",
            name: "split_terminal"
        },
        {
            separator: true
        },
        {
            label: "Run Task...",
            name: "run_task"
        },
        {
            label: "Run Build Task...",
            name: "run_build_task"
        },
        {
            label: "Run Active File",
            name: "run_active_file"
        },
        {
            label: "Run Selected Text",
            name: "run_selected_text"
        },
        {
            separator: true
        },
        {
            label: "Show Running Tasks...",
            name: "show_running_tasks"
        },
        {
            label: "Restart Running Task...",
            name: "restart_running_task"
        },
        {
            label: "Terminate Task...",
            name: "terminate_task"
        },
        {
            separator: true
        },
        {
            label: "Configure Tasks...",
            name: "configure_tasks"
        },
        {
            label: "Configure Default Build Task...",
            name: "configure_default_build_task"
        }
    ],

    help: [
        {
            label: "Welcome",
            name: "welcome"
        },
        {
            label: "Show All Commands",
            name: "show_all_commands"
        },
        {
            label: "Documentation",
            name: "documentation"
        },
        {
            label: "Editor Playground",
            name: "editor_playground"
        },
        {
            label: "Show Release Notes",
            name: "show_release_notes"
        },
        {
            separator: true
        },
        {
            label: "Keyboard Shortcuts Reference",
            name: "keyboard_shortcuts_reference"
        },
        {
            label: "Video Tutorials",
            name: "video_tutorials"
        },
        {
            label: "Tips and Tricks",
            name: "tips_and_tricks"
        },
        {
            separator: true
        },
        {
            label: "Join Us on YouTube",
            name: "join_us_on_youtube"
        },
        {
            label: "Search Feature Requests",
            name: "search_feature_requests"
        },
        {
            label: "Report Issue",
            name: "report_issue"
        },
        {
            separator: true
        },
        {
            label: "View License",
            name: "view_license"
        },
        {
            label: "Privacy Statement",
            name: "privacy_statement"
        },
        {
            separator: true
        },
        {
            label: "Toggle Developer Tools",
            name: "toggle_developer_tools"
        },
        {
            label: "Open Process Explorer",
            name: "open_process_explorer"
        },
        {
            separator: true
        },
        {
            label: "About",
            name: "about"
        }
    ]
    };

    return config;
  }  

  const handleDragBarMenButtonClick = (
    buttonName,
    /** @type {MouseEvent}*/ ev
  ) => {
    let buttonClicked = ev.target;
    let buttonParams = buttonClicked.getBoundingClientRect();

    let clientY = buttonParams.top + buttonParams.height;
    let clientX = buttonParams.left;
    
    menu({
      x: clientX,
      y: clientY,
      shouldBlur: true,
      options: menusByTab()[buttonName],
    });
  };

  let iconsPath = themeUtils.iconsPath();
  let maskSize = `-webkit-mask-size: 1rem !important;`;

  let vscodeIconPath = path.join(paths.icons, "default", "vscode.png");
</script>

<div class="dragbar_left">
  <div class="logo_placeholder">
    <img src={vscodeIconPath} alt="" />
  </div>

  {#each dragbarContextMenus as contextMenuButton}
    <div
      class="context_menu_button_placeholder"
      id="unselectable"
      on:click={(ev) => handleDragBarMenButtonClick(contextMenuButton.name, ev)}
    >
      {contextMenuButton.label}
    </div>
  {/each}

  <div
    class="context_menu_cake_menu"
    style="-webkit-mask: url('{`${iconsPath}/cake.svg`}') no-repeat center; {maskSize}"
  ></div>
</div>

<style>
  .dragbar_left {
    display: flex;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 0.7rem;
  }

  .logo_placeholder img {
    height: 1rem;
  }

  .logo_placeholder {
    /* margin-top: auto; */
    /* margin-bottom: auto; */
    margin-right: 0.5rem;
  }

  .context_menu_button_placeholder {
    margin-left: 0.1rem;
    color: #c9c9c9;
    font-size: 0.8rem;
    padding: 0.1rem 0.4rem;
  }

  .context_menu_button_placeholder:hover {
    background-color: #313232;
    color: #cccccc;
    cursor: default;
    border-radius: 0.3rem;
  }

  .context_menu_cake_menu {
    background-color: var(--sidebar-active-icon);
    width: 1rem;
    height: 1rem;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 0.5rem;
    display: none;
  }
</style>
