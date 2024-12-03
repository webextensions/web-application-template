/*
    Rename this file from config.development.local.example.js to config.development.local.js to run
    the build and server in local mode
*/

import inheritedConfig from './config.development._.js';

import extend from 'extend';

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

// eslint-disable-next-line import/no-default-export
export default extend(true, {}, inheritedConfig, configForThisMode);
