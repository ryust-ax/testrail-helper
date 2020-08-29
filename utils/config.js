"use strict";

const path = require("path");
const createLogger = require("logging").default;

const utils = require(".");

const logger = createLogger("Utility - Config");

function loadConfigFile(configFile, getFileRequire = require) {
  // .conf.js config file
  if (path.extname(configFile) === ".js") {
    return getFileRequire(configFile).config;
  }

  // json config provided
  if (path.extname(configFile) === ".json") {
    const contents = utils.getFileContents(configFile, "utf8");
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
  load(configFile, defaults = ["testrail.conf.js", "testrail.json"]) {
    logger.debug("Load configuration");
    // Add possible defaults
    const possibleConfigs = [configFile, ...defaults].filter((possible) => {
      return possible != null;
    });

    const file = possibleConfigs.find((file) => {
      try {
        const found = utils.resolveFile(file)
        logger.debug(found);
        return found;
      } catch (error) {
        logger.debug(error);
        return false;
      }
    });

    if (utils.isFile(file)) {
      return loadConfigFile(file);
    }

    throw new Error(
      `
      Can not load config from ${possibleConfigs}.
      TestRail Helper does not appear to be initialized.
      Execute 'testrail-helper init' to start
      `
    );
  },
};
