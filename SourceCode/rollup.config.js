require("dotenv").config();
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import livereload from 'rollup-plugin-livereload';
import { getBabelOutputPlugin  } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import path from 'path';
import fs from 'fs';

fs.exists('appname.txt', (appNameExists) => {
		if(!appNameExists) {
			fs.writeFile('appname.txt', process.env.APPLICATION_NAME, {encoding: 'utf-8'}, (err, res) => {
				if(err) {
					console.log("Error trying to write appname.txt");
				}
			});
		}
	}
);

const production = !false;
const bundleJSPath = path.resolve('./public/build/bundle.js');

const bundleCSSPath = path.resolve('./public/build/bundle.css')

// Edit here for the version which should be opened once compilation finishes.
let nwJSVersion = '' || process.env.NWJS_VERSION;

// For easy calculation of the current version being used
let versionToNumber = nwJSVersion.split(".").reduce((acc, val, index) => {
	val = parseInt(val);
	let digits = [100, 1, 0.1];
	acc += val * digits[index];
	return acc;
}, 0)

// If you have more version added in NWCache, add them here and in package.json;
let NWJSVersions = {
	"0.12.3": "0_12_3",
	"0.15.4": "0_15_4",
	"0.93.0": "0_93_0",
};

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: bundleJSPath
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write(bundleCSSPath);
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// If the version is less than 15, use babel
		// versionToNumber < 15 &&
		
		versionToNumber < 15 && getBabelOutputPlugin({
			presets: [["@babel/preset-env", { targets: { chrome: "41" }, loose: true }]],
			plugins: ["@babel/plugin-transform-arrow-functions"],
			allowAllFormats: true
		}),
		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: true
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', `start_${NWJSVersions[nwJSVersion]}`, '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
