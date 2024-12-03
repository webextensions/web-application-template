/*
    Rename this file from config.production.local.example.js to config.production.local.js to run
    the build and server in local mode
*/

import inheritedConfig from './config.production._.js';

import extend from 'extend';

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
        publicDirectory,
        useMinimize: true
    }
};

// eslint-disable-next-line import/no-default-export
export default extend(true, {}, inheritedConfig, configForThisMode);
