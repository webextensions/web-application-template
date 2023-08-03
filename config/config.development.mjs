import inheritedConfig from './config.common.mjs';

import extend from 'extend';

const publicDirectory = 'public-development';

const configForThisMode = {
    server: {
        verbose: false,
        access: {
            publicDirectory,
            url: {
                http: {
                    port: 8000,
                    redirectToHttps: false
                },
                https: {
                    enabled: false,
                    secretsAndSettings: {
                        key: 'config/local/https-keys/example.com+1-key.pem',
                        cert: 'config/local/https-keys/example.com+1.pem'
                    }
                }
            }
        },
        nonProductionDevTools: {
            skipHSTS: true,
            useLiveCssEditor: true,
            flagNotifyServerPathsOnLaunch: true,
            hardCodedResponses: [
                {
                    pattern: '/dummy-data/data.json',               // If "<pattern>" is found anywhere in req.originalUrl, it would be considered a match
                                                                    // "*" and "all" would match all requests, "none" or <falsy-value> would match none of the requests
                    status: 200,                                    // Default is 200
                    responseFile: 'test/data/data.json',            // Path relative to project's root folder
                                                                    // The file would be read in sync and sent as the response
                    type: 'json'                                    // If we use this, then comments would be stripped using "cjson" before sending the response,
                                                                    // to make the response a valid JSON
                }
            ]
        }
    },
    webpack: {
        mode: 'development', // Explicitly mentioning it so that it can be used when called programmatically (and not via webpack-cli with "--mode" parameter)

        verbose: false,
        publicDirectory,
        devtool: 'source-map',
        outputCssFilenamePattern: 'bundle.[name].ensure-freshness.css',
        outputJsFilenamePattern:  'bundle.[name].ensure-freshness.js'
    }
};

// eslint-disable-next-line import/no-default-export
export default extend(true, {}, inheritedConfig, configForThisMode);
