const rewire = require("rewire");

const utils = rewire("../../../utils/files");

// Retrieve internal function
const resolvePath = utils.__get__("resolvePath");

describe("Calculate default path", () => {
  test("Default is returned if no value provided", () => {
    const expected = ".";
    const shouldBeDot = resolvePath();

    expect(shouldBeDot).toEqual(expected);
  });

  test("Provided value is returned if value provided", () => {
    const expected = "./sample";
    const shouldBePath = resolvePath(expected);

    expect(shouldBePath).toEqual(expected);
  });
});
