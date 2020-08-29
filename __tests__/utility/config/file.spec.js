const mock = require("mock-fs");

const rewire = require("rewire");
const utils = rewire("../../../utils/config");

// Retrieve internal function
const loadConfigFile = utils.__get__("loadConfigFile");

describe("File contents can be retrieved", () => {
  afterEach(() => {
    mock.restore();
  });
  
  it('JS file is loaded', () => {
    const requireOverride = () => {
      return {
        config: {
          sample: () => { return "sample"; },
        }
      }
    }
    const configPath = "/root/file1.js"

    const foundConfig = loadConfigFile(configPath, requireOverride);
    expect(foundConfig).toHaveProperty("sample");

    const sampleValue = foundConfig.sample();
    expect(sampleValue).toEqual("sample");
  });

  it('JSON file is loaded', () => {
    mock({
      "/root": {
        "file1.json": `{ "sample": "contents" }`,
      },
    });

    const foundJson = loadConfigFile("/root/file1.json");
    expect(foundJson).toHaveProperty("sample");
    expect(foundJson.sample).toEqual("contents");
  });
});
