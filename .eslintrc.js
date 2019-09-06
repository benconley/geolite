module.exports = {
    "extends": "airbnb-base",
    rules: {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "no-underscore-dangle": ["error", { allowAfterThis: true }],
        "camelcase": ["error", { ignoreDestructuring: true, properties: "never" }],
    },
    overrides: [
        {
            files: ["*.e2e.js"],
            rules: {
                "import/no-extraneous-dependencies": 0,
            }
        }
    ],
    env: {
        "jest": true
    }
};
