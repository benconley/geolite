module.exports = {
    "extends": "airbnb-base",
    rules: {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "no-underscore-dangle": ["error", { allowAfterThis: true }],
        "camelcase": ["error", { ignoreDestructuring: true, properties: "never" }],
    },
    env: {
        "jest": true
    }
};
