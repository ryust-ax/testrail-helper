"use strict";

const path = require("path");

const { isFile } = require("./files");

const DEFAULT_CONFIG_FILES = ["testrail.conf.js", "testrail.json"]

function loadConfigFile(configFile) {
  // .conf.js config file
  if (path.extname(configFile) === ".js") {
    return require(configFile).config;
  }

  // json config provided
  if (path.extname(configFile) === ".json") {
    const contents = files.getFileContents(configFile, "utf8");
    return JSON.parse(contents);
  }

  throw new Error(`Config file ${configFile} can't be loaded`);
}

module.exports = {
  /**
   * Load config from a file.
   * If js file provided: require it and get .config key
   * If json file provided: load and parse JSON
   * If directory provided:
   * * try to load `testrail.conf.js` from it
   * * try to load `testrail.json` from it
   * If none of above: fail.
   *
   * @param {string} configFile
   * @return {*}
   */
  load(configFile) {
    // Find our starting point: provided path or default "."
    const startingPath = files.resolveDirectory(configFile);

    // Check for defaults

    // is path to directory
    const [file] = defaultFiles.map((file) => {
      const checkFile = path.join(configFile, file);

      if (isFile(checkFile)) {
        return checkFile;
      }
      return configPath;
    });

    if (isFile(file)) {
      return loadConfigFile(file);
    }

    // is config file
    if (isFile(configFile)) {
      return loadConfigFile(configFile);
    }
    if (!isFile(configFile)) {
      throw new Error(
        `Config file ${configFile} does not exist. Execute 'testrail-helper init' to create config`
      );
    }
    throw new Error(
      `Can not load config from ${file} \nTestRail Helper is not initialized in this dir. Execute 'testrail-helper init' to start`
    );
  },
};
