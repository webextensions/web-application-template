/*
    Rename this file from config.production.local.example.js to config.production.local.js to run
    the build and server in local mode
*/

const inheritedConfig = require('./config.production.js');

const publicDirectory = 'public-production-local';

const configForThisMode = {
    server: {
        // verbose: false,
        access: {
            publicDirectory,
            url: {
                // host: 'example.com'
                http: {
                    enabled: true,
                    port: 8000,
                    redirectToHttps: false
                },
                https: {
                    enabled: false
                    // port: 4430
                }
            }
        }
    },
    webpack: {
        // verbose: false,
        watch: true,
        publicDirectory,
        useMinimize: true
    }
};

module.exports = require('extend')(true, {}, inheritedConfig, configForThisMode);
