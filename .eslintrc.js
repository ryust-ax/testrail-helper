"use strict";

module.exports = {
  root: true,
  extends: ["axcient"],

  env: {
    es6: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
  },

  ignorePatterns: [
    "!.*",

    "node_modules/",
    "docs/",
    "vendor/",
    "tmp/",

    // Rejected / bin-ed code
    "-*",
  ],

  rules: {},

  overrides: [
    {
      files: ["utils/config.js"],

      rules: {
        "security/detect-non-literal-require": "off",
        "import/no-dynamic-require": "off",
      },
    },
  ],
};
