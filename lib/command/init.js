const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const mkdirp = require("mkdirp")
const { inspect } = require("util");
const createLogger = require("logging").default;

const { getTestRoot, fileExists, beautify } = require("../../utils");

const logger = createLogger("TestRail Helper - Initialize");

const defaultConfig = {
  "dir": "./output",
  "host": "https://testrail.domain",
  "user": "user@domain.net",
  "password": "user_password",
  "key": "user_api_key",
  "suiteId": 0,
  "projectId": 0,
  "planId": 0
};


// Processing
module.exports = function (initPath) {
  const testsPath = getTestRoot(initPath);

  const configFile = path.join(testsPath, "testrail.conf.js");
  if (fileExists(configFile)) {
    logger.error(`Config is already created at ${configFile}`);
    return;
  }

  inquirer.prompt([
    {
      name: "output",
      default: "./output",
      message: "Where should logs, screenshots, and reports to be stored?",
    },
    {
      name: "host",
      default: "https://testrail.domain",
      message: "Domain for testrail, not the full api path, no trailing slash.",
    },
    {
      name: "user",
      default: "user@domain.d",
      message: "Username for testrail login",
    },
    {
      name: "password",
      default: "user_password",
      message: "User password for UI login, not API key",
    },
    {
      name: "key",
      default: "api_key",
      message: "Currently not in use. User api key.",
    },
    {
      name: "suiteId",
      default: "0",
      message: "Integer matching the TestRail Suite Id",
    },
    {
      name: "projectId",
      default: "0",
      message: "Integer matching the TestRail Project Id",
    },
    {
      name: "planId",
      default: "0",
      message: "Integer matching the TestRail Plan Id",
    },
  ]).then((result) => {
    const config = defaultConfig;
    config.name = testsPath.split(path.sep).pop();
    config.output = result.output;
    config.host = result.host;
    config.user = result.user;
    config.password = result.password;
    config.key = result.key;
    config.suiteId = result.suiteId;
    config.projectId = result.projectId;
    config.planId = result.planId;

    const finish = () => {
      let configSource = beautify(`exports.config = ${inspect(config, false, 4, false)}`);

      fs.writeFileSync(configFile, configSource, "utf-8");
      logger.info(`Config created at ${configFile}`);

      if (config.output) {
        if (!fileExists(config.output)) {
          mkdirp.sync(path.join(testsPath, config.output));
          logger.info(`Directory for temporary output files created at "${config.output}"`);
        } else {
          logger.info(`Directory for temporary output files is already created at "${config.output}"`);
        }
      }
    }

    finish();
  });
}
