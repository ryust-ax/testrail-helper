const moment = require("moment-timezone");
const createLogger = require("logging").default;

const TestRail = require("../testrail/api");

const logger = createLogger("Reporter - TestRail");

function runName() {
  return `Automation run on ${moment()
    .tz("America/Denver")
    .format("YYYY-MM-DD h:mm")}`;
}

async function newClient(config) {
  const client = await TestRail.createClient(config);

  async function addToExistingPlan(name, { suiteId, planId }, caseIds) {
    const data = {
      suite_id: suiteId,
      name: name,
      include_all: false,
      case_ids: caseIds,
      runs: [
        {
          include_all: false,
          case_ids: caseIds,
        },
      ],
    };
    const { runs } = await client.addPlanEntry(planId, data);
    const [run] = runs;
    logger.debug("Add Plan Run");
    logger.debug(run);
    return run;
  }

  async function createNewRun(name, { projectId, suiteId }, caseIds) {
    const run = await client.addRun(projectId, {
      suite_id: suiteId,
      name: name,
      include_all: false,
    });
    logger.debug("Create Run");
    logger.debug(run);

    const result = await client.updateRun(run.id, {
      case_ids: caseIds,
    });
    logger.debug("Update Run");
    logger.debug(result);

    return run;
  }

  return {
    addResults: client.addResultsForCases,
    submitRun: function (name, config, caseIds) {
      if (config.planId) {
        return addToExistingPlan(name, config, caseIds);
      } else {
        return createNewRun(name, config, caseIds);
      }
    },
  }
}

module.exports = {
  report: async function (config, reports) {
    const client = await newClient(config);
    const name = runName();
    const caseIds = reports.map((t) => t.case_id);

    const run = await client.submitRun(name, config, caseIds);

    await client.addResults(run.id, { results: reports });
    return { run: run };
  },
};
