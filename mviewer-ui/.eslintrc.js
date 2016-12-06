module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
      "eslint:recommended","plugin:react/recommended"
    ],
    "plugins":[
      "react"
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "rules": {
        "brace-style": [
          "error"
        ],
        "eqeqeq": [
          "error"
        ],
        "no-multi-spaces": [
          "error"
        ],
        "comma-spacing": [
          "error"
        ],
        "key-spacing": [
          "error",
          { "beforeColon": true,
            "afterColon": true }
        ],
        "array-bracket-spacing": [
          "error"
        ],
        "no-trailing-spaces": [
          "error"
        ],
        "indent": [
            "error",
            2
        ],
        "curly": [
            "off",
            "multi"
        ],
        "linebreak-style": [
            "off",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};