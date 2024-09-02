import listEndpoints from 'express-list-endpoints';

// IMPORTANT: Ensure that res.locals.origin is set in some middleware before this handler is called

// eg: 'GET'.length = 3; 'POST'.length = 4; 'DELETE'.length = 6; 'OPTIONS'.length = 7
const longestHttpRequestMethodLength = 7;

const expressHandlers = function (app) {
    return function (req, res) {
        // Reference for an alternative custom solution:
        // https://stackoverflow.com/questions/14934452/how-to-get-all-registered-routes-in-express

        const routesList = listEndpoints(app, { includeMiddlewareRoutes: true });

        if (req.query.format === 'json') {
            return res.json(routesList);
        } else {
            let links = routesList.map((entry) => {
                let entryPath = entry.path;
                if (entryPath.includes('RegExp')) {
                    // do nothing
                } else {
                    entryPath = entryPath.replace(/\\/g, ''); // Useful for removing the backslash escaping like "\.path" to ".path"
                }
                const url = res.locals.origin + entryPath;

                /* eslint-disable @stylistic/indent-binary-ops */
                const str = (
                    '<div style="white-space:pre">' +
                        // There may be multiple HTTP request methods used, but we are using simple padding logic for upto a single method only
                        entry.methods.join(' ').padEnd(longestHttpRequestMethodLength) +
                        ' ' +
                        `<a target="_top" href="${url}">${entryPath}</a>` +
                    '</div>'
                );
                /* eslint-enable @stylistic/indent-binary-ops */
                return str;
            });

            links.sort();
            links = links.join('\n');

            /* eslint-disable @stylistic/indent */
            const html = [
                '<!doctype html>',
                '<html>',
                    '<head>',
                        '<title>Routes</title>',
                    '</head>',
                    '<body style="font-family:monospace">',
                        `<a target="_top" href="${res.locals.origin}">${res.locals.origin}</a>`,
                        '<br />',
                        '<br />',
                        links,
                    '</body>',
                '</html>'
            ].join('\n');
            /* eslint-enable @stylistic/indent */

            return res.send(html);
        }
    };
};

export { expressHandlers };
