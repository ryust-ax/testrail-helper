const fs = require("fs");
const path = require("path");

const axios = require("axios");
const createLogger = require("logging").default;

const logger = createLogger("Reporter - TestRail API");

class TestRail {
  constructor(config) {
    this.host = config.host;
    this.user = config.user;
    this.password = config.password;
    this.uri = "/index.php?/api/v2/";
    axios.defaults.baseURL = this.host + this.uri;
    axios.defaults.auth = {
      username: this.user,
      password: this.password,
    };
    axios.defaults.headers.get["Content-Type"] = "application/json";
  }

  async addPlan(projectId, data) {
    try {
      const res = await axios({
        method: "post",
        url: `add_plan/${projectId}`,
        data,
      });

      return res.data;
    } catch (error) {
      logger.error(`Cannot add new plan due to ${error}`);
    }
  }

  async addPlanEntry(planId, data) {
    try {
      const res = await axios({
        method: "post",
        url: `add_plan_entry/${planId}`,
        data,
      });

      return res.data;
    } catch (error) {
      logger.error(
        `Cannot add new test run to existing test plan due to ${error}`
      );
    }
  }

  async getSuites(projectId) {
    try {
      const res = await axios({
        method: "get",
        url: `get_suites/${projectId}`,

        headers: {
          "content-type": "application/json",
        },
      });

      return res.data;
    } catch (error) {
      logger.error(`Cannot get suites due to ${error}`);
    }
  }

  async getConfigs(projectId) {
    try {
      const res = await axios({
        method: "get",
        url: `get_configs/${projectId}`,

        headers: {
          "content-type": "application/json",
        },
      });

      return res.data;
    } catch (error) {
      logger.error(`Cannot get configs due to ${error}`);
    }
  }

  async addRun(projectId, data) {
    try {
      const res = await axios({
        method: "post",
        url: `add_run/${projectId}`,
        data,
      });

      return res.data;
    } catch (error) {
      logger.error(`Cannot add new run due to ${error}`);
    }
  }

  async updateRun(runId, data) {
    try {
      const res = await axios({
        method: "post",
        url: `update_run/${runId}`,
        data,
      });

      logger.info(`The run with id: ${runId} is updated`);

      return res.data;
    } catch (error) {
      logger.error(`Cannot update run due to ${error}`);
    }
  }

  async getTests(runId) {
    try {
      const res = await axios({
        method: "get",
        url: `get_tests/${runId}`,
      });

      return res.data;
    } catch (error) {
      logger.error(`Cannot get tests of ${runId} due to ${error}`);
    }
  }

  async getResultsForCase(runId, caseId) {
    try {
      const res = await axios({
        method: "get",
        url: `get_results_for_case/${runId}/${caseId}`,

        headers: {
          "content-type": "application/json",
        },
      });

      return res.data;
    } catch (error) {
      logger.error(
        `Cannot get results for case ${caseId} on run ${runId} due to ${error}`
      );
    }
  }

  async addResultsForCases(runId, data) {
    logger.debug("Add Results for Cases");
    logger.debug(runId);
    logger.debug(data);

    try {
      const res = await axios({
        method: "post",
        url: `add_results_for_cases/${runId}`,
        data,
      });

      return res.data;
    } catch (error) {
      logger.error(
        `Cannot add result for case due to ${error}. \n${JSON.stringify(
          error,
          null,
          2
        )}`
      );
    }
  }

  async addAttachmentToResult(resultId, imageFile) {
    const form = new FormData();

    form.append(
      "attachment",
      fs.createReadStream(path.join(global.output_dir, imageFile.toString()))
    );

    await axios({
      method: "post",
      data: form,
      url: `add_attachment_to_result/${resultId}`,
      headers: form.getHeaders(),
    }).catch((error) => {
      logger.error(`Cannot attach file due to ${error}`);
    });
  }
}

module.exports = {
  createClient(config) {
    return new TestRail(config);
  },
};
