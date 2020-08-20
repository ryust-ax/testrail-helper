
const fs = require("fs");
const path = require("path");
const parser = require("fast-xml-parser");
const createLogger = require("logging").default;

const logger = createLogger("Allure Collector");

function calculateCaseTime(start, stop) {
  return Math.round((stop - start) / 1000);
}

function getFiles(output) {
  return fs.readdirSync(output).filter((f) => f.includes(".xml"));
}

function getFileData(output, file) {
  logger.debug("Get File Data");
  logger.debug(output);
  logger.debug(file);
  return fs.readFileSync(path.join(output, file)).toString();
}

function getFileJson(data) {
  logger.debug("Get Json Data");
  logger.debug(data);
  return parser.parse(data, {
    attributeNamePrefix: "_",
    ignoreAttributes: false,
    parseAttributeValue: true,
  });
}

function getCases(json) {
  logger.debug("Extract from Json");
  logger.debug(json);
  return json["ns2:test-suite"]["test-cases"]["test-case"];
}

function buildCaseReports(testCases) {
  logger.debug("Build Case Reports");
  logger.debug(testCases);
  if (!Array.isArray(testCases)) {
    const report = buildCaseReport(testCases)
    return [report];
  }
  return testCases.map((testCase) => {
    return buildCaseReport(testCase);
  });
}

function buildCaseReport(testCase) {
  logger.debug("Considering case");
  logger.debug(testCase);
  const { name, _status, _start, _stop, failure } = testCase;

  // Skip pending tests
  if (_status === "pending") return;

  // Evaluate C***** for TestRail cases
  const found = name.match(/C\d{4,}/g);
  if (found === null) {
    logger.debug(`Case doesn't match expected testrail case.`);
    return;
  }

  // Extract test case id
  const [id] = found;

  // Calculate test run time
  const elapsed = calculateCaseTime(_start, _stop);

  // Determine status
  let statusId = 0;
  let comment = "";
  if (_status === "passed") statusId = 1;
  if (_status === "failed") {
    statusId = 5;
    comment = `\nReason: ${failure.message}`;
  }

  return {
    case_id: id.replace("C", ""),
    elapsed: elapsed === 0 ? "1s" : `${elapsed}s`,
    comment: `This test case has ${_status}.`,
    status: _status,
    status_id: statusId,
    comment: comment,
    failure: failure,
  };
}

function updateReportStatuses(reports) {
  logger.debug("Update Reports");
  logger.debug(reports);
  return reports.map((data) => {
    // Check for duplicate or retries
    const duplicate = reports.find((report) => {
      return report.case_id === data.case_id;
    });
    if (duplicate != undefined && duplicate.status_id === 5) {
      data.comment = `This test case has ${data.status} after retry. ${data.comment}`;
    }

    return data;
  });
}

function cleanup(reports) {
  logger.debug("Cleanup duplicates");
  logger.debug(reports);
  return reports.reduce((collect, report) => {
    if ("case_id" in report) {
      collect.push(report);
    }
    return collect;
  }, []);
}

function buildReports(output, files) {
  logger.debug("Build Reports");
  logger.debug(output);
  logger.debug(files);
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
    logger.debug("Target Directory");
    logger.debug(output);

    const files = getFiles(output);
    logger.debug("Get Files");
    logger.debug(files);

    return buildReports(output, files);
  }
};
