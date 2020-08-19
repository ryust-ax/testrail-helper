
const fs = require("fs");
const path = require("path");
const parser = require("fast-xml-parser");
const createLogger = require("logging").default;

const logger = createLogger("Allure Collector");

function calculateCaseTime(start, stop) {
  return Math.round((stop - start) / 1000);
}

function buildCaseReport(testCase) {
  logger.debug("Considering case");
  logger.debug(testCase);
  const { name, _status, _start, _stop, failure } = testCase;
  const found = name.match(/C\d{4,}/g);
  if (found === null) {
    logger.debug(`Case doesn't match expected testrail case.`);
    return {};
  }

  const elapsed = calculateCaseTime(_start, _stop);
  const [id] = found;
  return {
    case_id: id.replace("C", ""),
    elapsed: elapsed === 0 ? "1s" : `${elapsed}s`,
    comment: `This test case has ${_status}.`,
    status: _status,
    failure: failure,
  };
}

function updateReportStatuses(reports) {
  return reports.map((data) => {
    // Check for duplicate or retries
    const duplicate = reports.find((report) => {
      return report.case_id === data.case_id;
    });
    if (duplicate != undefined && duplicate.status_id === 5) {
      data.comment = `This test case has ${data.status} after retry.`;
    }

    if (data.status === "pending") return;
    if (data.status === "passed") data.status_id = 1;
    if (data.status === "failed") {
      data.status_id = 5;
      data.comment += `\nReason: ${data.failure.message}`;
    }
    // delete data.failure;
    return data;
  });
}

function getFiles(output) {
  return fs.readdirSync(output).filter((f) => f.includes(".xml"));
}

function getFileData(output, file) {
  return fs.readFileSync(path.join(output, file)).toString();
}

function getFileJson(data) {
  return parser.parse(data, {
    attributeNamePrefix: "_",
    ignoreAttributes: false,
    parseAttributeValue: true,
  });
}

function getCases(json) {
  return json["ns2:test-suite"]["test-cases"]["test-case"];
}

function buildCaseReports(testCases) {
  if (!Array.isArray(testCases)) {
    const report = buildCaseReport(testCases)
    return [report];
  }
  return testCases.map((testCase) => {
    return buildCaseReport(testCase);
  });
}

function cleanup(reports) {
  return reports.reduce((collect, report) => {
    if ("case_id" in report) {
      collect.push(report);
    }
    return collect;
  }, []);
}

function buildReports(output, files) {
  return files.flatMap((file) => {
    const data = getFileData(output, file);
    const json = getFileJson(data);
    const testCases = getCases(json);
    const reports = buildCaseReports(testCases);
    const submissions = updateReportStatuses(reports);
    return cleanup(submissions);
  })
}

module.exports = {
  gather: function({ output }) {
    const files = getFiles(output);
    return buildReports(output, files);
  }
};
