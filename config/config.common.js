const configForThisMode = {
    application: {
        name: 'Web Application Template'
    },
    server: {
        verbose: true,
        access: {
            publicDirectory: null, // ! Important note: This must be set in the configuration which extends this
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
        useCopyWebpackPlugin: true,
        publicDirectory: null, // ! Important note: This must be set in the configuration which extends this
        outputJsFilenamePattern: 'bundle.[name].[contenthash:20].js',
        outputCssFilenamePattern: 'bundle.[name].[contenthash:20].css'
    }
};

module.exports = configForThisMode;
