jest.mock("fs", () => {
  const fs = jest.requireActual("fs");
  const unionfs = require("unionfs").default;
  unionfs.reset = () => {
    unionfs.fss = [fs];
  };
  return unionfs.use(fs);
});

const fs = require("fs");
const { Volume } = require("memfs");

const utils = require("../../../utils/files");

describe("Getting contents of a file", () => {
  afterEach(() => {
    (fs).reset();
  });

  it('Direct file path returns valid file', () => {
    const vol = Volume.fromJSON(
      {
        "file1.txt": "contents",
      },
      "/root"
    );
    const fsMock = fs;
    fsMock.use(vol);

    const filePath = "/root/file1.txt";
    const contents = utils.getFileContents(filePath);
    expect(contents).toEqual("contents");
  });
});
