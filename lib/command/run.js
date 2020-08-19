const util = require("util");
const createLogger = require("logging").default;

const { Config } = require("../../utils");
const TestRail = require("../reporter/testrail");
const { AllureCollector } = require("../../utils/collect");

const logger = createLogger("TestRail Helper - Run");

function processRuntimeOptions(options) {
  const providedConfig = {};
  // from bin/testrail-helpers
  return {
    ...(options.dir && { dir: options.dir }),
    ...(options.host && { host: options.host }),
    ...(options.user && { user: options.user }),
    ...(options.password && { password: options.password }),
    ...(options.key && { key: options.key }),
    ...(options.suite && { suiteId: options.suite }),
    ...(options.project && { projectId: options.project }),
    ...(options.plan && { planId: options.plan }),
  }
}

// Processing
module.exports = async function (execOptions) {
  const runConfig = processRuntimeOptions(execOptions);
  logger.debug("Provided config");
  logger.debug(util.inspect(runConfig, { depth: 4 }));

  const fileConfig = Config.load(execOptions.config);
  logger.debug("File available config");
  logger.debug(util.inspect(fileConfig, { depth: 4 }));

  // Override file config with provided config
  const config = { ...fileConfig, ...runConfig };
  logger.debug("Runtime resulting config");
  logger.debug(util.inspect(config, { depth: 4 }));

  const reports = AllureCollector.gather(config);
  logger.debug("Collected reports");
  logger.debug(reports);

  const reported = await TestRail
    .report(config, reports)
    .then((response) => {
      return JSON.stringify(response, null, 2);
    })
    .catch((error) => {
      return error;
    });
  logger.info("Report results");
  logger.info(reported);
  return reported;
};
