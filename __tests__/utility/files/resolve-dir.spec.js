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

describe("Resolve a provided directory", () => {
  afterEach(() => {
    (fs).reset();
  });

  // Haven't figured how to override process.cwd() at this level
  // it('Relative file path returns valid directory even if incorrect file', () => {
  //   const vol = Volume.fromJSON(
  //     {
  //       "file1.txt": "contents",
  //     },
  //     "/root/sample"
  //   );
  //   const fsMock = fs;
  //   fsMock.use(vol);

  //   const foundDir = utils.resolveDirectory("sample/file2.txt");
  //   expect(foundDir).toEqual("/root/sample");
  // });

  it('Existent file path returns valid directory even if incorrect file', () => {
    const vol = Volume.fromJSON(
      {
        "file1.txt": "contents",
      },
      "/root"
    );
    const fsMock = fs;
    fsMock.use(vol);

    const foundDir = utils.resolveDirectory("/root/file2.txt");
    expect(foundDir).toEqual("/root");
  });

  it('Existent folder path with default file `codecept.conf.js` returns valid directory', () => {
    const vol = Volume.fromJSON(
      {
        "codecept.conf.js": "contents",
      },
      "/root"
    );
    const fsMock = fs;
    fsMock.use(vol);

    const foundDir = utils.resolveDirectory("/root/codecept.conf.js");
    expect(foundDir).toEqual("/root");
  });

  it('Existent folder path with default file `codecept.json` returns valid directory', () => {
    const vol = Volume.fromJSON(
      {
        "codecept.json": "contents",
      },
      "/root"
    );
    const fsMock = fs;
    fsMock.use(vol);

    const foundDir = utils.resolveDirectory("/root/codecept.json");
    expect(foundDir).toEqual("/root");
  });

  it('Non-existent file path throws error', () => {
    const vol = Volume.fromJSON(
      {
        "file1.txt": "contents",
      },
      "/root"
    );
    const fsMock = fs;
    fsMock.use(vol);

    expect(() => {
      utils.resolveDirectory("/roott/file2.txt");
    })
    .toThrowError(
      `Unable to resolve path to system [/roott]`
    );
  });
});
