/* eslint-disable filenames/match-exported */

const configForThisMode = {
    application: {
        name: 'Web Application Template'
    },
    server: {
        verbose: true,
        access: {
            publicDirectory: null,
            url: {
                http: {
                    enabled: true,
                    port: 80,
                    redirectToHttps: true
                },
                https: {
                    enabled: true,
                    port: 443
                },
                redirectToWww: true
            }
        },
        logger: {
            showLogLine: {
                enabled: true,
                showRelativePath: true
            }
        }
    },
    webpack: {
        verbose: true,
        publicDirectory: null,
        useCopyWebpackPlugin: true,
        outputCssFilenamePattern: 'bundle.[name].[contenthash:20].css',
        outputJsFilenamePattern: 'bundle.[name].[contenthash:20].js'
    }
};

// eslint-disable-next-line import/no-default-export
export default configForThisMode;
