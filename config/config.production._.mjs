import { logger } from 'note-down';
if (process.env.NODE_ENV !== 'production') {
    logger.warnHeading('Warning: Production configuration is being loaded while process.env.NODE_ENV is not set as production.');
    logger.warn(
        'Unless you know what you are doing, you may wish to abort the process and resolve this issue before proceeding.' +
        '\nRecommendation: Prefix your command with "NODE_ENV=production"'
    );
}

import inheritedConfig from './config.common.mjs';

import extend from 'extend';

const publicDirectory = 'public-production';

const configForThisMode = {
    server: {
        access: {
            publicDirectory,
            url: {
                // host: 'example.com',
                http: {
                    port: 8000, // Ensure that the port 8000 is "forwarded" to port 80 in the production server
                    redirectToHttps: true
                },
                https: {
                    enabled: false // In ideal production setup, https should be enabled
                }
            }
        }
    },
    webpack: {
        publicDirectory,
        useMinimize: true
    }
};

// eslint-disable-next-line import/no-default-export
export default extend(true, {}, inheritedConfig, configForThisMode);
