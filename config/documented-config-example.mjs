/* eslint-disable filenames/match-exported */

/*
import { logger } from 'note-down';
if (process.env.NODE_ENV !== 'production') {
    logger.warnHeading('Warning: Production configuration is being loaded while process.env.NODE_ENV is not set as production.');
    logger.warn(
        'Unless you know what you are doing, you may wish to abort the process and resolve this issue before proceeding.' +
        '\nRecommendation: Prefix your command with "NODE_ENV=production"'
    );
}
/* */

// import path from 'node:path';

// import extend from 'extend';

// import inheritedConfig from './config.development._.mjs';

const publicDirectory = 'public-development-local';

const configForThisMode = {
    application: {
        name: 'Web Application Template'
    },
    server: {
        // workers: 1,                                              // 1 / <number-of-workers>
        verbose: true,
        access: {
            // publicDirectory: null,                               // optional ; null / <public-path>
            // publicDirectory: path.join(__dirname, '../public-development-local/'),
            serveDotWellKnownDirectoryForSslCertificate: true,
            url: {
                http: {
                    enabled: false,                                 // false / true
                    port: 80,                                       // 80 / <port-number>
                                                                    // Note:
                                                                    //     For production, you may wish to run the application on another port, say 8000 and map that port to 80
                                                                    //     Please understand how HSTS works in case you wish to run your application on non-standard ports
                    redirectToHttps: false                          // false / true
                },
                https: {
                    enabled: false,                                             // false / true
                    // secretsAndSettings: {                                    // https://nodejs.org/api/tls.html
                    //     key: 'config/local/https-keys/example.com.key',      // <https-key>
                    //     cert: 'config/local/https-keys/example.com.crt',     // <https-certificate>
                    //     ca: [
                    //         'config/local/https-keys/ca.cer',
                    //         'config/local/https-keys/fullchain.cer'
                    //     ],
                    //     passphrase: 'dummy-passphrase',                      // <https-passphrase>
                    //     requestCert: false,                                  // false/true
                    //     rejectUnauthorized: false                            // false/true
                    // },
                    port: 443                                                   // 443 / <port-number>
                                                                                // Note:
                                                                                //     For production, you may wish to run the application on another port, say 4430 and map that port to 443
                                                                                //     Please understand how HSTS works in case you wish to run your application on non-standard ports
                },

                // References:
                //     - https://stackoverflow.com/questions/1417963/php-setcookie-for-domain-but-not-subdomains/1417979#1417979
                //     - http://www.yes-www.org/why-use-www/
                //     - https://news.ycombinator.com/item?id=11004396
                redirectToWww: false                                // false / true
                                                                    // Note:
                                                                    //     example.com should get redirected to www.example.com, but canonical hostnames,
                                                                    //     like: localhost, user-laptop, 127.0.0.1, 192.168.193.10 would not get redirected
            }
            // security: {
            //     limitAccessWithBasicAuth: false                  // false/true (When set to a truthy value, basic HTTP authentication would be used before loading any of the contents)
            // }
        },
        nonProductionDevTools: {
            skipHSTS: true,
            skipUpgradeInsecureRequests: true,
            useLiveCssEditor: true
            // networkDelay: {                                              // Random delay in network requests
            //     minimum: 0,                                              // optional ; null / <non-negative-integer>
            //     maximum: 0                                               // optional ; null / <non-negative-integer>
            // },
            // hardCodedResponses: [
            //     {
            //         pattern: '/dummy-data/test.json',                    // '<pattern>'
            //                                                              // If '<pattern>' is found anywhere in req.originalUrl, it would be considered a match
            //                                                              // '*' and 'all' would match all requests, 'none' or <falsy-value> would match none of the requests
            //         status: 200,                                         // 200 / <custom-status-code>
            //         responseFile: path.join(__dirname, '../test/data/test.json'),
            //                                                              // The file would be read in sync and sent as the response
            //         type: 'json'                                         // If we use this, then comments would be stripped using 'cjson' before sending the response,
            //                                                              // to make the response a valid JSON
            //     }
            // ]
        },
        // devTools: {
        //     obscuredSourceMaps: false,                                   // false/<string>
        //     sourceMaps: {
        //         block: false                                             // false / true
        //         overrideBlockingWithAccessCode: false,                   // false / <string-which-is-key> when 'sourceMaps.block: true'
        //         overrideBlockingWithAccessCode: 'ActivateSourceMapsMode'
        //     }
        // },
        logger: {                                                           // Note: Do not use console.log() directly. Use it through note-down as the logger.
            type: 'console',
            // modes: {
            //     saveToFile: {
            //         enabled: false,                                      // false / true
            //         directory: null,                                     // null / '<directory>' for storing log file
            //         // directory: path.join(__dirname, '../logs/'),
            //         fileName: null                                       // null / '*<format>*' (excluding quotes) to be used as log file's name
            //         // fileName: 'logs-<yyyy-mm-dd>.log'
            //     }
            // },
            showLogLine: {
                enabled: true,                                              // false / true - Show the file path and line number of code initiating the console log
                showRelativePath: true                                      // false / true - Show only the relative path of the file w.r.t. project root
            }
        }
    },
    // db: {
    //     path: path.join(__dirname, '..', 'database', 'web-application-template'),
    //     port: 27017,
    //     name: 'web-application-template'
    // },
    webpack: {
        // mode: 'development',                                             // 'development' / 'production'

        verbose: true,
        publicDirectory,
        // templateToHtml: {
        //     useCDNJQuery: true,
        //     useTrackTime: true,
        //     useSafeAndSecure: false
        // },
        outputCssFilenamePattern: 'bundle.[name].[contenthash:20].css',
        outputJsFilenamePattern:  'bundle.[name].[contenthash:20].js',      // It seems that we need to use '[name].bundle.[hash].js' when webpack-dev server is being used
                                                                            // Other useful values to check:
                                                                            //     '[name].bundle.[hash].js'
                                                                            //     'bundle.[name].[chunkhash].js'
                                                                            //     '[name].bundle.[chunkhash].js'
        useMinimize: false,
        skipEntry: false                                                    // Set it to true to skip bundling JS/CSS dependencies etc in the ".html.template" file
    }
};

// export default extend(true, {}, inheritedConfig, configForThisMode);
export default configForThisMode; // eslint-disable-line import/no-default-export
