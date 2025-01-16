const eslintConfigIronPlateReact = require('eslint-config-ironplate/react.js');

module.exports = [
    {
        ignores: [
            'resources/3rdparty/**/*.*'
        ]
    },

    ...eslintConfigIronPlateReact,

    {
        // Add ESLint plugins here. If they are stable and useful, move those as a pull
        // request to https://github.com/webextensions/eslint-config-ironplate/
        plugins: {
        },

        // Add ESLint rules here. If they are stable and useful, move those as a pull
        // request to https://github.com/webextensions/eslint-config-ironplate/
        rules: {
            '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: true, exceptions: { ImportAttribute: false, Property: false } }]
        }
    }
];
