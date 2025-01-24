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

themesToCompile.forEach((themeName) => {
    const themeFolder = path.join(dirname, themeName);
    const configFilePath = path.join(themeFolder, 'config.json');
    const configFile = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    
    let inactiveColor = configFile.inactiveColor
    let activeColor = configFile.activeColor

    let cssFileContent = `
        .var-sidebar-inactive-icon {
            background-color: ${inactiveColor};
        }
            
        .var-sidebar-active-icon {
            background-color: ${activeColor};
        }

        .window_control  .icon:not(.inactive), .dragbar_center .icon:not(.inactive){
           background-color: ${inactiveColor};
        }
    
        .sidebar .icon_placeholder.pressed .upper_icon, .sidebar .icon_placeholder:hover .upper_icon, .sidebar .icon_placeholder:hover .bottom_icon{
           background-color: ${activeColor};
        }
    
        .sidebar .upper_icon, .sidebar  .bottom_icon{
           background-color: ${inactiveColor};
        }
    `;

    cssFileContent += parseBGColors(configFile.backgroundColors);
    console.log(
        cssFileContent
    )
})