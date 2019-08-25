/*
    Rename this file from config.development.local.example.js to config.development.local.js to run
    the build and server in local mode
*/

const inheritedConfig = require('./config.development.js');

const publicDirectory = 'public-development-local';

const configForThisMode = {
    server: {
        // verbose: true,
        access: {
            publicDirectory,
            url: {
                // host: 'example.com',
                http: {
                    enabled: true,
                    port: 8000,
                    redirectToHttps: false
                },
                https: {
                    enabled: false,
                    port: 4430
                }
            }
        }
    },
    webpack: {
        // verbose: true,
        publicDirectory
    }
};

module.exports = require('extend')(true, {}, inheritedConfig, configForThisMode);
