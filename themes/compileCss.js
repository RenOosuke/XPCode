const fs = require('fs');
const path = require('path');

const themesToCompile = [
    'Classic',
];

const dirname = path.resolve('');

const parseBGColors = (backgroundColors) => {
    let themeFile = '';

    Object.keys(backgroundColors).forEach((varName) => {
        themeFile += `
        .var-${varName} {
            background-color: ${backgroundColors[varName]};
        }
        `
    });

    return themeFile;
}

const parseTextColors = (colors) => {
    let themeFile = '';

    Object.keys(colors).forEach((varName) => {
        themeFile += `
        .var-${varName} {
            color: ${colors[varName]};
        }
        `
    });

    return themeFile;
}

const parseBorderColors = (borders) => {
    let themeFile = '';

    Object.keys(borders).forEach((varName) => {
        themeFile += `
        .var-${varName} {
            border-color: ${borders[varName]};
        }
        `
    });

    return themeFile;
}

const parseSimpleHovers = (simpleHovers) => {
    let themeFile = '';

    Object.keys(simpleHovers.background).forEach((varName) => {
        themeFile += `
        .var-${varName}:hover {
            background-color: ${simpleHovers.background[varName]};
        }
        `
    });

    Object.keys(simpleHovers.color).forEach((varName) => {
        themeFile += `
        .var-${varName}:hover {
            color: ${simpleHovers.color[varName]};
        }
        `
    });

    return themeFile;
}

const parseOutlineColor = (customCSS) => {
    let themeFile = `
        .resize-border:hover {
            background-color: ${customCSS["outline-color"]};
        }

       .header-part:focus {
            outline-color: ${customCSS["outline-color"]};
        }

        .explorer-tab.window-outlined>:not(.explorer-tab-header) {
            outline: ${customCSS["outline-color"]} 1px solid;
        }

        .explorer-tab-header.outlined {
            outline: ${customCSS["outline-color"]} 1px solid;
        }

        .staging-directory-name:focus {
            outline-color: ${customCSS["outline-color"]};
        }

        ._hovered {
            border: solid 1px ${customCSS["outline-color"]} !important;
        }

        
        .staging-true input:focus {
            outline: none;
            border: solid 1px ${customCSS["outline-color"]};
        }

        .header-part:focus {
            outline-color: ${customCSS["outline-color"]};
        }

        .file_search_box {
            border: solid 1px ${customCSS["outline-color"]}; 
        }

        .resize-border:hover {
            background-color: ${customCSS["outline-color"]};
        }
        
        blue {
            color: ${customCSS["file-search-marker-color"]};
        }
    `;

    return themeFile;
}

const parseAdditionalCustomCSS = (customCSS, borderColors, textColors) => {
    return`
    .header-part:hover:not(._hovered):not(.var-item-select-bg) {
        background-color: ${customCSS["file-hover-unselected"]};
        cursor: pointer;
    }

    .hasError input {
        border: solid 1px ${borderColors["error-border-color"]} !important;
    }

    [data-title-top]:after, [data-title-left]:after, [data-title-right]:after, [data-title-bottom]:after  {
        background-color: ${customCSS["tooltip-bg"]};
        border: solid ${borderColors["secondary-border-color"]} 1px;
        color: ${textColors["base-text-color"]};
    }
    `;
}

themesToCompile.forEach((themeName) => {
    const themeFolder = path.join(dirname, themeName);
    const configFilePath = path.join(themeFolder, 'config.json');
    const configFile = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    
    let inactiveColor = configFile.inactiveColor
    let activeColor = configFile.activeColor

    const customCSS = configFile.custom;

    let cssFileContent = `
        .window_control  .icon:not(.inactive), .dragbar_center .icon:not(.inactive){
           background-color: ${inactiveColor};
        }
    
        .sidebar .icon_placeholder.pressed .upper_icon, .sidebar .icon_placeholder:hover .upper_icon, .sidebar .icon_placeholder:hover .bottom_icon{
           background-color: ${activeColor};
        }
    
        .sidebar .upper_icon, .sidebar  .bottom_icon{
           background-color: ${inactiveColor};
        }

        .window-blurred .dragbar {
            background-color: ${configFile.backgroundColors["window-blurred-dragbar-bg"]} !important;
            color: #9d9d9d !important;
        }

        .window-blurred .dragbar .context_menu_button_placeholder {
            color: #9d9d9d !important;
        }

        .explorer-tab-header.folder.grayed-out + .current-directory .var-item-select-bg {
            background-color: ${customCSS["gray-out-selection"]} !important;
        }

        .explorer-tab-header.outline.grayed-out + .current_outline .var-item-select-bg {
            background-color: ${customCSS["gray-out-selection"]} !important;
        }

        .staging-true .var-item-select-bg {
            background-color: ${customCSS["gray-out-selection"]} !important;
        }

        .single-tab-button {
            background-color: ${configFile.textColors["base-text-color"]};
        }
            
        .recent_files .single_file_row:first-of-type .right_side::before {
            color: ${configFile.textColors["file-search-sections-labels-color"]};
        }
            
        .all_files .single_file_row:first-of-type .right_side::before {
            color: ${configFile.textColors["file-search-sections-labels-color"]};
        }

        .file_search_window {
            border-color: ${configFile.backgroundColors["directory-rename-bg"]};
        }
    `;

    cssFileContent += parseBGColors(configFile.backgroundColors);
    cssFileContent += parseTextColors(configFile.textColors);
    cssFileContent += parseBorderColors(configFile.borderColors);
    cssFileContent += parseSimpleHovers(configFile.simpleHovers);
    cssFileContent += parseOutlineColor(customCSS);
    cssFileContent += parseAdditionalCustomCSS(customCSS, configFile.borderColors, configFile.textColors);

    const cssFilePath = path.join(themeFolder, 'theme.css');
    fs.writeFileSync(cssFilePath, cssFileContent, 'utf-8');
})