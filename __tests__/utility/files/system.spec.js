const rewire = require("rewire");
const mock = require("mock-fs");

const utils = rewire("../../../utils/files");

// Retrieve internal function
const resolveSystemPath = utils.__get__("resolveSystemPath");
const systemPath = utils.__get__("systemPath");
const cwd = () => { return "/root"; }

describe("Get a system path", () => {
  afterEach(() => {
    mock.restore();
  });

  test("System Path Stats return for file", () => {
    mock({
      "/root/configPath": {
        "sample.txt": "Sample contents",
      },
    });
    const providePath = "/root/configPath/sample.txt";
    const shouldBeStats = systemPath(providePath);

    expect(shouldBeStats.isFile()).toEqual(true);
  });

  test("System Path Stats return for directory", () => {
    mock({
      "/root/configPath": {},
    });
    const providePath = "/root/configPath";
    const shouldBeStats = systemPath(providePath);

    expect(shouldBeStats.isDirectory()).toEqual(true);
  });

  test("System Path Stats return for relative directory", () => {
    mock({
      "/root/configPath": {},
    });
    const providePath = "configPath";
    const shouldBeStats = systemPath(providePath, cwd);

    expect(shouldBeStats.isDirectory()).toEqual(true);
  });

  test("System Path Stats throw error if not present", () => {
    mock({
      "/root": {},
    });
    const providePath = "/root/configPath";
    expect(() => {
      systemPath(providePath, cwd);
    })
    .toThrowError(`Unable to resolve path to system [${providePath}]`);
  });

  test("System Path returns value if stats reports a directory", () => {
    utils.__set__("systemPath", () => {
      return {
        isDirectory: () => { return true; },
      };
    });
    // mock({
    //   "/root/configPath": {},
    // });
    const providePath = "configPath";
    const shouldBePath = resolveSystemPath(providePath);

    expect(shouldBePath).toEqual("configPath");
  });

  test("System Path returns value if stats reports a file", () => {
    utils.__set__("systemPath", () => {
      return {
        isDirectory: () => { return false; },
        isFile: () => { return true; },
      };
    });
    // mock({
    //   "/root/configPath": {},
    // });
    const providePath = "configPath";
    const shouldBePath = resolveSystemPath(providePath);

    expect(shouldBePath).toEqual("configPath");
  });

  test("System Path throws error if stats not a file or directory", () => {
    utils.__set__("systemPath", () => {
      return {
        isDirectory: () => { return false; },
        isFile: () => { return false; },
      };
    });
    const providePath = "configPath";
    expect(() => {
      resolveSystemPath(providePath)
    })
    .toThrowError(
      `Provided path was neither file nor directory [${providePath}]`
    );
  });
});
