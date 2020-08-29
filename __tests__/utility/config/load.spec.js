const mock = require("mock-fs");

const config = require("../../../utils/config");

describe("Configuration file can be loaded", () => {
  afterEach(() => {
    mock.restore();
  });

  it('Custom JS file module is loaded', () => {
    mock({
      "/root": {
        "file1.js": `module.exports = {
          config: {
            sample: () => { return "sample"; },
          }
        };`,
      },
    });
    const configPath = "/root/file1.js"

    const foundConfig = config.load(configPath);
    expect(foundConfig).toHaveProperty("sample");

    const sampleValue = foundConfig.sample();
    expect(sampleValue).toEqual("sample");
  });

  it('Custom JS file export config is loaded', () => {
    mock({
      "/root": {
        "file1.js": `exports.config = {
          sample: () => { return "sample"; },
        };`,
      },
    });
    const configPath = "/root/file1.js"

    const foundConfig = config.load(configPath);
    expect(foundConfig).toHaveProperty("sample");

    const sampleValue = foundConfig.sample();
    expect(sampleValue).toEqual("sample");
  });

  it('Default JS file export config is loaded', () => {
    mock({
      "/root": {
        "file1.js": `exports.config = {
          sample: () => { return "sample"; },
        };`,
      },
      // "/": {
      //   "root": {
      //     "file1.js": `exports.config = {
      //       sample: () => { return "sample"; },
      //     };`,
      //   },
      //   "testrail.conf.js": `exports.config = {
      //     sample: () => { return "sample"; },
      //   };`,
      // },
    });
    const configPath = "/root/file1.js"

    const foundConfig = config.load(configPath);
    expect(foundConfig).toHaveProperty("sample");

    const sampleValue = foundConfig.sample();
    expect(sampleValue).toEqual("sample");
  });

  it('Custom JSON file is loaded', () => {
    mock({
      "/root": {
        "file1.json": `{ "sample": "contents" }`,
      },
    });

    const foundJson = config.load("/root/file1.json");
    expect(foundJson).toHaveProperty("sample");
    expect(foundJson.sample).toEqual("contents");
  });
});
