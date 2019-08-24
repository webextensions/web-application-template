#!/usr/bin/env node

// This script finds mismatches between top-level node_modules/ and package.json and informs the user

// How to use:
//
//     $ ./check-npm-install-status.js
//           OR
//     $ ./check-npm-install-status.js --return-exit-code

const t1 = new Date();

const
    fs = require('fs'),
    path = require('path'),
    http = require('https');

const returnExitCode = (process.argv[2] === '--return-exit-code');

const semverFilePath = path.join(__dirname, 'semver.js');

// http://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries/22907134#22907134
function download(url, dest, cb) {
    const file = fs.createWriteStream(dest);
    const request = http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb); // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) {
            cb(err.message);
        }
    });
    request.setTimeout(15000, function () {
        // Note: It appears that in some cases of network failure, there is some weird problem with Node JS
        // due to which request.abort() may not work fine (eg: When trying to access a URL and network is
        // enabled in VirtualBox guest machine, but internet is disconnected in host machine).
        // Using process.kill() as a fallback.
        request.abort();
        request.destroy();
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        cb('Timed out');
        process.kill(process.pid, 'SIGKILL');
    });
}

// http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically/171256#171256
function mergeObjects(obj1, obj2) {
    const obj3 = {};
    for (const attr in obj1) {
        obj3[attr] = obj1[attr];
    }
    for (const attr in obj2) {
        obj3[attr] = obj2[attr];
    }
    return obj3;
}

function readFileAsJson(filePath) {
    try {
        const
            data = fs.readFileSync(filePath, 'utf-8'),
            json = JSON.parse(data);
        return json;
    } catch (e) {
        return undefined;
    }
}

function exitWithCodeIfRequired(exitCode) {
    if (returnExitCode) {
        process.exit(exitCode);
    } else {
        process.exit(0);
    }
}

function main(rootPath) {
    const semver = require(semverFilePath);

    const
        mainPackageJsonPath = path.resolve(rootPath, 'package.json'),
        mainPackageJson = readFileAsJson(mainPackageJsonPath),
        allDependencies = mergeObjects(mainPackageJson.dependencies, mainPackageJson.devDependencies);
    let
        mismatchFound = false,
        invalidFound = false;

    const updateMessages = [];
    Object.keys(allDependencies).forEach(function (packageName) {
        const
            packageJson = readFileAsJson(path.resolve(rootPath, 'node_modules', packageName, 'package.json')),
            valid = packageJson && semver.valid(packageJson.version);
        if (!valid) {
            invalidFound = true;
        }
        const match = valid && semver.satisfies(packageJson.version, allDependencies[packageName]);
        if (!match) {
            mismatchFound = true;
        }
        if (!valid || !match) {
            updateMessages.push(packageName + ' : ' + ((packageJson && packageJson.version) || 'NA') + ' -> ' + allDependencies[packageName]);
        }
    });

    const t2 = new Date();
    if (!mismatchFound && !invalidFound) {
        // All npm packages are loosely matching. It might be fine to skip running "$ npm install"
        exitWithCodeIfRequired(0);
    } else {
        try {
            const chalk = require('chalk');
            const chalkRedOrYellow = returnExitCode ? chalk.red : chalk.yellow;
            console.log(chalkRedOrYellow('\n' + updateMessages.length + '/' + Object.keys(allDependencies).length + ' npm packages need to be updated: (' + ((t2 - t1) / 1000) + ' seconds)'));
            console.log('    ' + updateMessages.join('\n    '));
            console.log(chalkRedOrYellow('You might want to run "$ npm install"\n'));
        } catch (e) {
            console.log('\nCould not load module "chalk"');
            console.log('\n' + updateMessages.length + '/' + Object.keys(allDependencies).length + ' npm packages need to be updated: (' + ((t2 - t1) / 1000) + ' seconds)');
            console.log('    ' + updateMessages.join('\n    '));
            console.log('You might want to run "$ npm install"\n');
        }
        exitWithCodeIfRequired(1);
    }
}

function initiateCheck() {
    const
        rootPath = path.resolve(__dirname, '..', '..', '..'),
        returnCode = main(rootPath);

    exitWithCodeIfRequired(returnCode);
}

try {
    fs.statSync(semverFilePath);
    initiateCheck();
} catch (e) {
    const url = 'https://raw.githubusercontent.com/npm/node-semver/master/semver.js';
    console.log('\nDownloading (timeout: 15s) ' + url + ' (to be used in check-npm-install-status.js)');
    download(url, semverFilePath, function (errMsg) {
        if (errMsg) {
            console.log('Error: ' + errMsg);
            console.log('Unable to download semver.js. Skipping detection of top-level mismatches between node_modules/ and package.json.\n');
            exitWithCodeIfRequired(1);
            return;
        }
        initiateCheck();
    });
}
