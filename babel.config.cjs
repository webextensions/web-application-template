// https://babeljs.io/docs/en/babel-preset-env
const presets = [
    [
        '@babel/preset-env',
        {
            // https://babeljs.io/docs/en/babel-preset-env#targets
            targets: {
                firefox: '68',
                chrome: '75'
            }
        }
    ]
];

module.exports = { presets };
