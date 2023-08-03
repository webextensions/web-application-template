#!/usr/bin/env node

/* global exec */

import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import _ from 'lodash';
import { deleteSync } from 'del';

import { logger } from '../../utils/logger.mjs';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
require('shelljs/global');

const __dirname = dirname(fileURLToPath(import.meta.url));

// TODO: Use globs for these patterns

const patternsMarkedToKeep = [
    '.husky/_/',
    'node_modules/',
    'config/config.development.local.mjs',
    'config/config.production.local.mjs'
];

const patternsToDelete = [
    // /^public\/(.*\.bundle\..*\.css)/,
    // /^public\/(.*\.bundle\..*\.js)/,
    // /^public\/(.*\.bundle\..*\.map)/,

    // /^public-development-local\/(.*)/,
    // /^public-production-local\/(.*)/,

    /^public-(.*)\/(.*)/
];

const doCleanup = function (cmd, itemTerm, flagFilterInOnlyFolders, callback) {
    const output = exec(
        cmd,
        {
            async: false,
            silent: true,
            cwd: path.join(__dirname, '..', '..')
        }
    ).stdout;

    const listOfPotentialItemsToClean = output
        .trim()
        .split('\n')
        .map(function (item) {
            return item.replace(/^Would remove /, '');
        })
        .filter(function filterInOnlyFoldersIfAskedSo(item) {
            if (flagFilterInOnlyFolders) {
                if (item.endsWith('/')) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        })
        .filter(function filterOutPatternsMarkedForSkipping(item) {
            for (const patternMarkedToKeep of patternsMarkedToKeep) {
                if (
                    typeof patternMarkedToKeep === 'string' &&
                    item === patternMarkedToKeep
                ) {
                    return false;
                } else if (item.match(patternMarkedToKeep)) {
                    return false;
                }
            }
            return true;
        });

    const listOfItemsToClean = listOfPotentialItemsToClean
        .filter(function (item) {
            for (const patternToDelete of patternsToDelete) {
                if (
                    typeof patternToDelete === 'string' &&
                    item === patternToDelete
                ) {
                    return true;
                } else if (item.match(patternToDelete)) {
                    return true;
                }
            }
            return false;
        });

    if (listOfPotentialItemsToClean.length === 0) {
        logger.success(`The ${itemTerm}(s) are already clean. No ${itemTerm}(s) to delete.`);
        return callback();
    } else if (listOfPotentialItemsToClean.length === listOfItemsToClean.length) {
        logger.info('\nThe following ' + listOfItemsToClean.length + ` ${itemTerm}(s) are going to be deleted:`);
        listOfItemsToClean.forEach(function (itemToClean) {
            console.log('    * ' + itemToClean);
        });
        logger.warn('\nAbout to delete the above mentioned ' + listOfItemsToClean.length + ` ${itemTerm}(s).`);
        process.stdout.write('5');
        setTimeout(function () { process.stdout.write(' 4'); }, 1000);
        setTimeout(function () { process.stdout.write(' 3'); }, 2000);
        setTimeout(function () { process.stdout.write(' 2'); }, 3000);
        setTimeout(function () { process.stdout.write(' 1'); }, 4000);
        setTimeout(function () { process.stdout.write(' Start'); }, 5000);

        setTimeout(function () {
            const countOfDeletedItems = deleteSync(listOfItemsToClean);
            logger.success('\nDeleted ' + countOfDeletedItems.length + ` ${itemTerm}(s).`);
            callback();
        }, 5000);
    } else {
        logger.error(`Error: The following ${itemTerm}(s) are not being tracked, not marked for keeping and not marked for deleting.`);
        // https://stackoverflow.com/questions/38865869/how-to-find-difference-between-two-array-using-lodash-underscore-in-nodejs/38866051#38866051
        const differentItems = _.differenceWith(listOfPotentialItemsToClean, listOfItemsToClean, _.isEqual);
        differentItems.forEach(function (differentItem) {
            console.log('    * ' + differentItem);
        });

        process.exit(1);
    }
};

// Get list of files and directories which are ignored from Git repository
const commandToDeleteIrrelevantItems = 'git clean -n -d -X';

doCleanup(commandToDeleteIrrelevantItems, 'item', false, function () {
    const commandToDeleteEmptyIrrelevantDirectories = 'git clean -n -d -x';

    doCleanup(commandToDeleteEmptyIrrelevantDirectories, 'folder', true, function () {
        // done
    });
});
