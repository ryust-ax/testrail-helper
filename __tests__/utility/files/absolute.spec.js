const rewire = require("rewire");

const utils = rewire("../../../utils/files");

// Retrieve internal function
const resolveAbsolutePath = utils.__get__("resolveAbsolutePath");

describe("Get an absolute path", () => {
  test("Providing absolute path returns that value", () => {
    const providePath = "/..sample/absolute/path";
    const shouldBePath = resolveAbsolutePath(providePath);

    expect(shouldBePath).toEqual(providePath);
  });

  test("Providing relative path returns absolute path value", () => {
    const providePath = "..sample/absolute";
    const expectedPath = "/..sample/absolute"
    const shouldBePath = resolveAbsolutePath(providePath);

    expect(shouldBePath).toEqual(expectedPath);
  });
});
