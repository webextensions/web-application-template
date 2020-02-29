#!/usr/bin/env node

const
    path = require('path'),
    fs = require('fs'),
    { execSync } = require('child_process');

let logger;
try {
    logger = require('note-down');
} catch (e) {
    logger = require('../../../../utils/logger.js');
}

const
    projectRoot = path.join(__dirname, '..', '..', '..', '..'),
    packageCjsonFilePath = path.join(projectRoot, 'package.cjson');

let commandOutput = execSync(
    // Alternatively, use 'npm outdated --json', but that may not lead to an output for the cases where the installed
    // dependency is already at newer version, due to "^" and "~" characters in the semver syntax
    'npm-check-updates --jsonUpgraded',
    {
        cwd: projectRoot,
        encoding: 'utf8'
    }
);

commandOutput = JSON.parse(commandOutput);

const packagesToUpdate = Object.keys(commandOutput);

const originalPackageCjsonContents = fs.readFileSync(packageCjsonFilePath, 'utf8');

let updatedPackageCjsonContents = originalPackageCjsonContents;

for (const nameOfPackageToUpdate of packagesToUpdate) {
    let latestSemverValue = commandOutput[nameOfPackageToUpdate];
    // LAZY: Handling only the common syntaxes. There can be other syntaxes which aren't handled.
    latestSemverValue = commandOutput[nameOfPackageToUpdate]
        .replace('^', '')
        .replace('~', '')
        .replace('=', '');
    updatedPackageCjsonContents = updatedPackageCjsonContents.replace(
        // LAZY: Handling only the common syntaxes. There can be other syntaxes which aren't handled.
        new RegExp(`"${nameOfPackageToUpdate}"[\\s]*:[\\s]*"[0-9.^~=]+"`),
        // LAZY: Replacing with "^" sign assuming that is the only case we need to cover for now
        `"${nameOfPackageToUpdate}": "^${latestSemverValue}"`
    );
}

if (originalPackageCjsonContents === updatedPackageCjsonContents) {
    logger.success(' ✓ package.cjson seems up-to-date.');
} else {
    fs.writeFileSync(packageCjsonFilePath, updatedPackageCjsonContents);
    logger.warn(` ✓ Updated: ${packageCjsonFilePath}`);
}
