#!/usr/bin/env node

// This script finds mismatches between Node version in use and the .nvmrc file
//
// How to use:
//
//     $ ./check-node-version.mjs
//           OR
//     $ ./check-node-version.mjs --return-exit-code

import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import semver from 'semver';

import { logger } from '../../utils/logger.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const returnExitCode = (process.argv[2] === '--return-exit-code');

const exitWithCodeIfRequired = function (exitCode) {
    if (returnExitCode) {
        process.exit(exitCode);
    } else {
        process.exit(0);
    }
};

const nodeVersion = process.versions.node;
const loggerWarnOrError = returnExitCode ? logger.error : logger.warn;
try {
    const
        dotNvmrcPath = path.resolve(__dirname, '../../.nvmrc'),
        dotNvmrcContents = fs.readFileSync(dotNvmrcPath, 'utf8');
    if (!semver.satisfies(nodeVersion, dotNvmrcContents)) {
        logger.log('');
        logger.success(' ✓   .nvmrc suggests: Node JS ' + dotNvmrcContents);
        loggerWarnOrError(' ✗ You currently use: Node JS ' + nodeVersion);
        loggerWarnOrError('\nYou might want to run:');
        loggerWarnOrError('    $ nvm use\n');
        exitWithCodeIfRequired(1);
    }
} catch (e) {
    loggerWarnOrError('\nWarning: Unable to read the .nvmrc file\n');
    exitWithCodeIfRequired(1);
}
