const rewire = require("rewire");

const utils = rewire("../../../utils/files");

// Retrieve internal function
const resolveDirectoryPath = utils.__get__("resolveDirectoryPath");

describe("Get a directory path", () => {
  test("Providing directory path returns that value", () => {
    const providePath = "..sample/absolute/path";
    const shouldBePath = resolveDirectoryPath(providePath);

    expect(shouldBePath).toEqual(providePath);
  });

  test("Providing file path returns directory path value", () => {
    const providePath = "..sample/absolute/path.txt";
    const expectedPath = "..sample/absolute"
    const shouldBePath = resolveDirectoryPath(providePath);

    expect(shouldBePath).toEqual(expectedPath);
  });
});
