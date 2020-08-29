"use strict";

const Config = require("./config");
const fileUtils = require("./files");

module.exports = {
  Config,
  ...fileUtils,
};
