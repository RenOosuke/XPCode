let nwJSVersion = '' || process.env.NWJS_VERSION;

// For easy calculation of the current version being used
let versionToNumber = nwJSVersion.split(".").reduce((acc, val, index) => {
	val = parseInt(val);
	let digits = [100, 1, 0.1];
	acc += val * digits[index];
	return acc;
}, 0)

const babel = require("@babel/core");
const fs = require("fs");
const path = require("path");

// Input and Output Directories
const inputDir = "src/scripts";
const outputDir = "public/modules";

// Ensure Output Directory Exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to Transpile a Single File
function transpileFile(inputFilePath, outputFilePath) {
    let code = fs.readFileSync(inputFilePath, "utf8");

    if(versionToNumber < 15) {
        code = babel.transformSync(code, {
            presets: [["@babel/preset-env", { targets: { chrome: "41" }, loose: true }]],
            plugins: ["@babel/plugin-transform-arrow-functions"]
        });
    };

    fs.writeFileSync(outputFilePath, code);
    
    console.log(`Transpiled: ${inputFilePath} → ${outputFilePath}`);
}

// Recursive Function to Read All Files & Folders
function readAllChildren(dirToRead, outputBase) {
    
    fs.readdirSync(dirToRead, { withFileTypes: true }).forEach((entry) => {
        const inputPath = path.join(dirToRead, entry.name);
        const outputPath = path.join(outputBase, entry.name);
        
        if (entry.isDirectory()) {
            fs.mkdirSync(outputPath, { recursive: true });
            // Recursively process subdirectory
            readAllChildren(inputPath, outputPath);
        } else if (entry.isFile() && entry.name.endsWith(".js")) {
            // Transpile JavaScript file
            transpileFile(inputPath, outputPath);
        }
    });
}

// Start Recursive Processing
readAllChildren(inputDir, outputDir);

console.log("Babel Transpilation Completed.");
