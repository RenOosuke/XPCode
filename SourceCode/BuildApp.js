// #DOCUMENT_THIS_FILE
const SDK = false;
// TO OPTIMIZE DOWNLOAD URLS 
// #NWBUILD_DOWNLOAD_OPTIMIZE
const projectName = 'XPCode';
const versionNumber = '0.15.4';
const platform = 'win'
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const decompress = require('decompress');

const NWVersions = {
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
    'public'
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

(async ()=> {
    copyProjectFiles();
    installNPMPackages();
    await checkForNWCache();
})()