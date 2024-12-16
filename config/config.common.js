import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const configForThisMode = {
    application: {
        name: 'Web Application Template',
        frontEnd: {
            useCdn: false,

            storageConsent: {
                enabled: false
            },

            showDevTools: false
        }
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
        },
        database: {
            sqlite: {
                // databaseFilePath: ':memory:' // DEBUG-HELPER
                databaseFilePath: path.resolve(__dirname, '..', 'app-data', 'sqlite.db')
            }
        }
    },
    webpack: {
        configs: [
            'index.html',
            '.admin/admin.html'
        ],
        verbose: true,
        publicDirectory: null,
        useCopyWebpackPlugin: true,
        outputCssFilenamePattern: 'bundle.[name].[contenthash:20].css',
        outputJsFilenamePattern: 'bundle.[name].[contenthash:20].js'
    }
};

// eslint-disable-next-line import/no-default-export
export default configForThisMode;
