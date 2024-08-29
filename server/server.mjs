#!/usr/bin/env node

/* eslint-env node */

'use strict';

import { Command } from 'commander';

import { application } from './application.mjs';

const program = new Command();

program
    .option('-c, --config <config-file>', 'Configuration file to be used (eg: config/config.development.local.mjs)')
    .parse(process.argv);

const options = program.opts();
application.start({
    configOptionsFileRootRelativePath: options.config
});
