import path from 'node:path';

import fs from 'node:fs';

import handlebars from 'handlebars';

import { logger } from 'note-down';

class TemplateToHtmlPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        const _this = this;
        const
            templateFilePath = _this.options.template,
            templateFileName = path.basename(templateFilePath),
            outputHtmlFilename = templateFileName.replace(/\.template$/, '');

        compiler.hooks.compilation.tap('TemplateToHtmlPlugin', function (compilation) {
            compilation.hooks.processAssets.tap(
                {
                    name: 'TemplateToHtmlPlugin',
                    stage: compilation.constructor.PROCESS_ASSETS_STAGE_ADDITIONAL
                },
                function () {
                    // Add file to watch
                    // https://webpack.js.org/contribute/plugin-patterns/#monitoring-the-watch-graph
                    compilation.fileDependencies.add(templateFilePath);

                    const templateFileContents = fs.readFileSync(_this.options.template, 'utf8');

                    // TODO: Refactor it
                    handlebars.registerHelper('loadAllCssAndJsChunks', function (context, options) { // eslint-disable-line no-unused-vars
                        const chunks = context.data.root.chunks;

                        let
                            cssCode = '',
                            jsCode = '';
                        Object.keys(chunks).forEach(function (key) {
                            const
                                chunk = chunks[key],
                                filePath = chunk.filePath;
                            if (filePath.match(/\.css$/)) {
                                cssCode += `<link rel="stylesheet" href="${filePath}" />`;
                            } else if (filePath.match(/\.js$/)) {
                                jsCode += `\n<script src="${filePath}"></script>`;
                            }
                        });

                        return cssCode + '\n' + jsCode;
                    });

                    /*
                    // TODO: Remove all the hard codings and hard mappings
                    handlebars.registerHelper('loadScript', function (context, options) { // eslint-disable-line no-unused-vars
                        const
                            contextHash = context.hash,
                            defaultSrc = contextHash['data-default-src'],
                            defaultType = contextHash['data-default-type'],
                            webpackChunk = contextHash['data-webpack-chunk'];
                        return (
                            '<script' +
                                (function () {
                                    let str = '';
                                    const chunk = context.data.root.chunks[webpackChunk] || {};
                                    if (chunk.filePath) {
                                        str += ' src="'  + chunk.filePath + '"';
                                    } else {
                                        if (defaultSrc) {
                                            str += ' src="'  + defaultSrc  + '"';
                                        }
                                        if (defaultType) {
                                            str += ' type="' + defaultType + '"';
                                        }
                                    }
                                    return str;
                                }()) +
                            '>' +
                            '</script>'
                        );
                    });

                    // TODO: Remove all the hard codings and hard mappings
                    handlebars.registerHelper('loadStylesheet', function (context, options) { // eslint-disable-line no-unused-vars
                        const
                            contextHash = context.hash,
                            defaultHref = contextHash['data-default-href'],
                            webpackChunk = contextHash['data-webpack-chunk'];
                        return (
                            '<link' +
                                ' rel="stylesheet"' +
                                (function () {
                                    let str = '';
                                    const chunk = context.data.root.chunks[webpackChunk] || {};
                                    if (chunk.filePath) {
                                        str += ' href="'  + chunk.filePath + '"';
                                    } else {
                                        if (defaultHref) {
                                            str += ' href="'  + defaultHref  + '"';
                                        }
                                    }
                                    return str;
                                }()) +
                            ' />'
                        );
                    });
                    /* */

                    const compiledTemplate = handlebars.compile(templateFileContents);

                    const context = JSON.parse(JSON.stringify(_this.options.contextData));
                    context.chunks = context.chunks || {};

                    compilation.chunks.forEach(function (chunk) {
                        const chunkFiles = chunk.files;

                        const isFileCssOrJs = function (fileName) {
                            if (fileName.endsWith('.css') || fileName.endsWith('.js')) {
                                return true;
                            }
                            return false;
                        };

                        // There might be multiple files in the chunk (for example: a .css file along with a .js file)
                        for (const chunkFileName of chunkFiles) {
                            if (isFileCssOrJs(chunkFileName)) {
                                context.chunks[chunkFileName] = {
                                    filePath: chunkFileName,
                                    type: (function (chunkFileName) {
                                        if (chunkFileName.endsWith('.css')) {
                                            return 'css';
                                        } else if (chunkFileName.endsWith('.js')) {
                                            return 'js';
                                        }
                                    }(chunkFileName))
                                };
                            }
                        }
                    });

                    try {
                        const html = compiledTemplate(context);

                        // Insert this file into the webpack build as a new file asset:
                        compilation.emitAsset(outputHtmlFilename, {
                            source: function () {
                                return html;
                            },
                            size: function () {
                                return html.length;
                            }
                        });

                        logger.success(`\nCompiled ${templateFilePath} to ${outputHtmlFilename}`);
                    } catch (e) {
                        console.log(e);
                        logger.error(
                            `\nCould not compile the HTML template:` +
                            `\n    Input: ${templateFilePath}` +
                            `\n    Output: ${outputHtmlFilename}`
                        );
                    }
                }
            );
        });
    }
}

export { TemplateToHtmlPlugin };
