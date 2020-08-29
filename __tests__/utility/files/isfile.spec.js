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

describe("Resolve a provided file", () => {
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
    const foundFile = utils.isFile(filePath);
    expect(foundFile).toEqual(true);
  });
  // Need to figure out process.cwd() before can resolveFile for a relative path

  it('Non-existent file throws error', () => {
    const vol = Volume.fromJSON(
      {
        "file1.txt": "contents",
      },
      "/root"
    );
    const fsMock = fs;
    fsMock.use(vol);

    const filePath = "/roott/file2.txt";
    const foundFile = utils.isFile(filePath);
    expect(foundFile).toEqual(false);
  });
});
