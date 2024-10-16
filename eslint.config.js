const eslintIronPlateConfig = require('eslint-config-ironplate');

module.exports = [
    {
        // https://eslint.org/docs/latest/use/configure/ignore
        //
        // IMPORTANT:
        //     * https://github.com/eslint/eslint/discussions/18304#discussioncomment-9069706
        //     * https://github.com/eslint/eslint/discussions/17429#discussioncomment-6579229
        ignores: [
            // 'node_modules/**' is ignored by default

            // Auto-generated directories and contents
            'public-*/**',

            'scripts/health-checks/check-npm-install-status/semver.cjs'
        ]
    },

    ...eslintIronPlateConfig,

    {
        files: [
            '**/*.cjs',
            '**/*.js',
            '**/*.jsx',
            '**/*.mjs'
        ],

        // Add ESLint plugins here. If they are stable and useful, move those as a pull
        // request to https://github.com/webextensions/eslint-config-ironplate/
        plugins: {
        },

        // Add ESLint rules here. If they are stable and useful, move those as a pull
        // request to https://github.com/webextensions/eslint-config-ironplate/
        rules: {
            'no-unused-vars': ['error', {
                caughtErrors: 'none'
            }],
            // https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/callback-return.md
            'n/callback-return': [
                'error',
                [
                    'callback',
                    'done',
                    'res.end',
                    'res.send',
                    'res.status',
                    'next',
                    'exitWithError'
                ]
            ]
        }
    }
];
