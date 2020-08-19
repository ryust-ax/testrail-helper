const fs = require("fs");
const path = require("path");

const { fileExists, isFile } = require("./files");

function loadConfigFile(configFile) {
  // .conf.js config file
  if (path.extname(configFile) === '.js') {
    return require(configFile).config;
  }

  // json config provided
  if (path.extname(configFile) === '.json') {
    return JSON.parse(fs.readFileSync(configFile, 'utf8'));
  }
  throw new Error(`Config file ${configFile} can't be loaded`);
}



module.exports = {

  /**
   * Load config from a file.
   * If js file provided: require it and get .config key
   * If json file provided: load and parse JSON
   * If directory provided:
   * * try to load `codecept.conf.js` from it
   * * try to load `codecept.json` from it
   * If none of above: fail.
   *
   * @param {string} configFile
   * @return {*}
   */
  load: function (configFile) {
    configFile = path.resolve(configFile || '.');

    if (!fileExists(configFile)) {
      throw new Error(`Config file ${configFile} does not exist. Execute 'codeceptjs init' to create config`);
    }

    // is config file
    if (isFile(configFile)) {
      return loadConfigFile(configFile);
    }

    // is path to directory
    const jsConfig = path.join(configFile, 'testrail.conf.js');
    if (isFile(jsConfig)) {
      return loadConfigFile(jsConfig);
    }

    const jsonConfig = path.join(configFile, 'testrail.json');
    if (isFile(jsonConfig)) {
      return loadConfigFile(jsonConfig);
    }

    throw new Error(`Can not load config from ${jsConfig} or ${jsonConfig}\nCodeceptJS is not initialized in this dir. Execute 'codeceptjs init' to start`);
  }
}
