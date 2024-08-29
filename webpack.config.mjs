#!/usr/bin/env node

/* eslint-disable filenames/match-exported */

import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';

import { webpackConfigGenerator } from './webpack/webpack-config-generator.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const showHelp = function () {
    const
        cmdWebpack = path.relative(process.cwd(), process.argv[1]),
        pathToConfig = path.relative(process.cwd(), path.join(__dirname, 'config'));

    console.log(chalk.gray([
        '',
        'Format:',
        `    ${cmdWebpack} --mode <compilation-mode> --env config="<path-to-config-file>" --env <option1> --env <option2> ... --env <optionN>`,
        '',
        'Examples:',
        `    ${cmdWebpack} --mode development --env config="${pathToConfig}/config.development.local.mjs"`,
        `    ${cmdWebpack} --mode development --env config="${pathToConfig}/config.development.local.mjs" --env silent`,
        `    NODE_ENV=production ${cmdWebpack} --mode production --env config="${pathToConfig}/config.production.local.mjs"`,
        `    ${cmdWebpack} --env help`,
        '',
        'Options:',
        '    --env config="<path-to-config-file>"',
        '    --env silent',
        '    --env help',
        ''
    ].join('\n')));
};

const exitWithError = function (errMsg) {
    console.log(chalk.red(errMsg));
    process.exit(1);
};
const showHelpAndExitWithError = function (errMsg) {
    showHelp();
    exitWithError(errMsg);
};

const currentDir = process.cwd();

// https://webpack.js.org/configuration/configuration-types/
const webpackConfig = async function (env, argv) {    // eslint-disable-line no-unused-vars
    env = env || {};

    const silent = env.silent;

    if (env.help) {
        showHelp();
        process.exit(0);
    }

    if (!env.config || typeof env.config !== 'string') {
        showHelpAndExitWithError('You need to pass an appropriate parameter for "--env config=');
        process.exit(1);
    }

    const configFilePath = path.resolve(currentDir, env.config);

    if (!silent) {
        console.log(chalk.blue('Reading config from file: ' + configFilePath));
    }
    let flagBasedWebpackConfig;
    try {
        flagBasedWebpackConfig = (await import(configFilePath)).default.webpack;
    } catch (e) {
        console.log('An error occurred.');
        console.log('Error stack trace:');
        console.log(e);
        const exampleConfigFilePath = path.resolve(__dirname, 'config/config.development.local.example.mjs');
        console.info(chalk.yellow('Ref: You may want to check the example file at ' + exampleConfigFilePath));
        return exitWithError('Error summary: Invalid or unavailable file ' + configFilePath);
    }

    const generatedWebpackConfig = webpackConfigGenerator(flagBasedWebpackConfig);
    return generatedWebpackConfig;
};

// eslint-disable-next-line import/no-default-export
export default webpackConfig;
