import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import chalk from 'chalk';

import { notifyCompletionStatus } from './utils/notify-completion-status.mjs';

import { TemplateToHtmlPlugin } from './plugins/TemplateToHtmlPlugin/TemplateToHtmlPlugin.mjs';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// Somehow using "import" is not working:
//     import CopyWebpackPlugin from 'copy-webpack-plugin';
// So, using the "require" way:
//     const CopyWebpackPlugin = require('copy-webpack-plugin');
// Probably because of this:
//     https://github.com/webpack-contrib/copy-webpack-plugin/issues/709#issuecomment-1242330791
// Probably using `import(...)` based syntax would make it work
const CopyWebpackPlugin = require('copy-webpack-plugin');

const __dirname = dirname(fileURLToPath(import.meta.url));

const projectRoot = path.join(__dirname, '..');

const webpackConfigGenerator = function (generatorOptions = {}) {
    const {
        mode,
        verbose,
        watch = false,
        useMinimize,
        useCopyWebpackPlugin,
        publicDirectory,
        // obscuredSourceMaps = false,
        skipEntry = false,
        // useCDNJQuery,
        // useSafeAndSecure,
        // useTrackTime,
        outputJsFilenamePattern = 'bundle.[name].[contenthash:20].js',
        outputCssFilenamePattern = 'bundle.[name].[contenthash:20].css'
    } = generatorOptions;

    const
        nodeModulesAtProjectRoot = path.resolve(projectRoot, 'node_modules'),
        targetPublicDirectory = path.join(projectRoot, publicDirectory);

    let useHmr = false;
    if (process.env.USE_HMR === 'yes') {
        useHmr = true;
    }

    // const
    //     templateToHtml = generatorOptions.templateToHtml || {},

    if (verbose) {
        console.log(chalk.blue('Generating webpack configuration for:'));
        console.log(chalk.blue('    ' + JSON.stringify(generatorOptions, null, '    ').replace(/\n/g, '\n    ')));
    }

    const config = {
        watch,

        entry: (function () {
            if (skipEntry) {
                // If we wish for "entry" to be empty, it needs to be a function,
                // otherwise some validations from webpack's end would kick-in and it
                // would error out considering it to be a mistake
                // Reference: https://github.com/webpack/webpack/issues/3123
                return function () {
                    return {};
                };
            } else {
                return {
                    index: [
                        useHmr ? 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000' : null,
                        path.join(projectRoot, 'src', 'index.js')
                    ].filter((x) => x)
                    // custom: [path.join(projectRoot, 'src', 'custom.js')]
                    // chunkSafeAndSecure: [ path.join(projectRoot, 'src', '1stparty', 'safe-and-secure', 'safe-and-secure.js') ]
                };
            }
        }()),
        output: {
            path: targetPublicDirectory,
            filename: outputJsFilenamePattern
        },

        // // https://webpack.js.org/configuration/externals/
        // // https://webpack.github.io/docs/library-and-externals.html
        // externals: {
        //     jquery: 'jQuery'
        // },

        // // https://webpack.js.org/configuration/resolve/
        // resolve: {
        //     // https://webpack.js.org/configuration/resolve/#resolvemodules
        //     modules: [
        //         projectRoot + '/' + publicDirectory + '/',
        //         path.join(__dirname, '..', './node_modules')
        //     ]
        // },

        module: {
            rules: [
                // https://github.com/babel/babel-loader#usage
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                        plugins: (() => {
                            const arr = [];

                            // arr.push('transform-es2015-modules-commonjs');
                            if (useHmr) {
                                arr.push('react-refresh/babel');
                            }

                            return arr;
                        })()
                    },
                    // https://github.com/nuxt/nuxt.js/issues/1668#issuecomment-330510870
                    // https://stackoverflow.com/questions/45246365/webpack-2-how-to-exclude-all-node-modules-except-for/45246482#45246482
                    // https://github.com/webpack/webpack/issues/2031#issuecomment-219040479
                    // https://github.com/webpack/webpack/issues/2031#issuecomment-244921229
                    // https://github.com/webpack/webpack/issues/2031#issuecomment-283517150
                    // https://github.com/webpack/webpack/issues/2031#issuecomment-290384493
                    // https://github.com/webpack/webpack/issues/2031#issuecomment-317589620
                    // exclude: /node_modules/
                    exclude: function (modulePath) {
                        if (modulePath.indexOf(nodeModulesAtProjectRoot) === 0) {
                            return true;
                        } else {
                            return false;
                        }

                        // // Do not ignore src/node_modules (useful for cases where node_modules is a custom folder and
                        // // not created via a package manager like npm)
                        // if (/src\/node_modules/.test(modulePath)) {
                        //     return false;
                        // } else if (/node_modules/.test(modulePath)) {
                        //     return true;
                        // } else {
                        //     return false;
                        // }
                    }
                },
                // {
                //     test: /\.(js|jsx)$/,
                //     loader: 'babel-loader?' + JSON.stringify({ presets: ['env']}) + '!eslint-loader',
                //     exclude: /node_modules/
                // },
                {
                    test: /\.css$/,
                    use: [
                        // {
                        //     loader: MiniCssExtractPlugin.loader
                        // },
                        MiniCssExtractPlugin.loader,
                        // 'css-loader'
                        {
                            // https://adamrackis.dev/css-modules/
                            loader: 'css-loader',
                            options: {
                                // https://webpack.js.org/loaders/css-loader/#object-2
                                modules: {
                                    auto: function (resourcePath) {
                                        if (
                                            // TODO: FIXME: Create a separate "vendor.css" or similarly named file
                                            resourcePath.indexOf('/node_modules/') >= 0
                                        ) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    },
                                    localIdentName: '[name]__[local]--[hash:base64:5]'
                                }
                            }
                        }
                    ]
                }
                // {
                //     test: /\.css$/,
                //     // https://github.com/webpack/style-loader
                //     // https://github.com/webpack/css-loader
                //     loader: 'style-loader!css-loader'
                // },
                // {
                //     test: /\.less$/,
                //     // https://github.com/webpack/style-loader
                //     // https://github.com/webpack/css-loader
                //     // https://github.com/webpack/less-loader
                //     loader: 'style-loader!css-loader!less-loader'
                // },
                // {
                //     test: /\.html$/,
                //     loader: 'html-script-module-loader!html-loader!./index.html',
                //     exclude: /node_modules/
                // }
            ]
        },

        optimization: {
            minimize: useMinimize,
            emitOnErrors: false,
            splitChunks: {
                // TODO: Adjust minSize and maxSize to more practical values
                minSize: 50000,
                maxSize: 2000000,

                automaticNameDelimiter: '.',

                // https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks
                // chunks: 'all',
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors', // https://webpack.js.org/plugins/split-chunks-plugin/#splitchunksname
                        chunks: 'all'
                    }
                }
            },
            // The runtime should be in its own chunk
            runtimeChunk: {
                // name: 'runtime'
            }
        },

        // devtool: 'source-map',
        devtool: 'inline-source-map',

        plugins: (function () {
            const plugins = [];

            // plugins.push(new webpack.SourceMapDevToolPlugin({
            //     exclude: [
            //         /3rdparty/,
            //         /node_modules/
            //     ],
            //     filename: (function () {
            //         let filename = '';
            //         if (obscuredSourceMaps) {
            //             filename = '[file].' + obscuredSourceMaps + '.map';
            //         } else {
            //             filename = '[file].map';
            //         }
            //         return filename;
            //     }()),
            //     // https://webpack.js.org/plugins/source-map-dev-tool-plugin/#options
            //     // https://github.com/webpack/webpack/issues/1609#issuecomment-156747371
            //     //     - Only "false" or "undefined" can be used as a value for append
            //     append: obscuredSourceMaps ? false : undefined
            // }));

            plugins.push(new MiniCssExtractPlugin({
                filename: outputCssFilenamePattern
            }));

            if (useCopyWebpackPlugin) {
                plugins.push(
                    new CopyWebpackPlugin(
                        {
                            patterns: (function () {
                                const arr = [
                                    {
                                        from: path.join(projectRoot, 'src', 'favicon.ico'),
                                        to: targetPublicDirectory
                                    }
                                ];
                                return arr;
                            }())
                        },
                        {
                            copyUnmodified: false
                        }
                    )
                );
            }

            plugins.push(new TemplateToHtmlPlugin({
                template: path.join(projectRoot, 'src', 'index.html.template'),
                entry: {
                    // chunkSafeAndSecure: entry.chunkSafeAndSecure
                },
                contextData: {
                    // useCDNJQuery,
                    // useSafeAndSecure,
                    // useTrackTime
                }
            }));

            if (useHmr) {
                plugins.push(new webpack.HotModuleReplacementPlugin());
                plugins.push(new ReactRefreshWebpackPlugin());
            }

            // https://webpack.js.org/api/compiler-hooks/#hooks
            // https://github.com/kossnocorp/on-build-webpack/issues/5#issuecomment-432192978
            // https://stackoverflow.com/questions/30312715/run-command-after-webpack-build/49786887#49786887
            plugins.push({
                apply: (compiler) => {
                    compiler.hooks.done.tap('done', (stats) => {
                        notifyCompletionStatus(stats);
                    });
                }
            });

            return plugins;
        }()),

        // https://webpack.js.org/configuration/stats/
        stats: {
            // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/271#issuecomment-449694009
            children: false,

            errorDetails: true
        }
    };

    if (mode) {
        config.mode = mode;
    }

    if (verbose) {
        console.log(chalk.blue('Generated webpack configuration:'));
        console.log(chalk.blue('    ' + JSON.stringify(config, null, '    ').replace(/\n/g, '\n    ')));
    }

    return config;
};

export { webpackConfigGenerator };
