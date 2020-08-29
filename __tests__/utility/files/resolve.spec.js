// const rewire = require("rewire");

jest.mock("fs");

it('example', () => {
  const fs = require('fs');
  fs.__configureFs({
    '/test': {
      'a.foo': '---',
      'b.bar': fs.__mockFile({
        content: 'file content',
        ctime: new Date(1),
        mtime: new Date(1),
      }),
    },
  });

  const results = fs.readdirSync('/test');
  expect(results.length).toBe(2);
  expect(results).toEqual('a.foo', 'b.bar');
});

// describe("Resolve a provided directory", () => {
//   const MOCK_FILE_INFO = {
//     "/root": {
//       "configPath0": {},
//       "configPath1/config.txt": "config1 content",
//       "configPath2/codecept.conf.js": "config2 content",
//       "configPath3/codecept.json": "config3 content",
//       "configPath4/codecept.conf.js": "config4 a content",
//       "configPath4/codecept.json": "config4 b content",
//     },
//   };
//   const MOCK_FILE_DIRS = {
//     "/root": {
//       "configPath1/config.txt": "config1 content",
//       "configPath2/codecept.conf.js": "config2 content",
//       "configPath3/codecept.json": "config3 content",
//       "configPath4": {
//         "codecept.conf.js": "config4 a content",
//         "codecept.json": "config4 b content",
//       },
//     },
//   };

//   const newFs = require("fs");

//   beforeEach(() => {
//     newFs.__setMockFiles(MOCK_FILE_INFO);
//     // newFs.__setStats({ isDirectory: false, isFile: false });
//     newFs.__setMockSystem(MOCK_FILE_DIRS);
//     // newFs.__loadRealFile({ name: fileUtils, filePath: "utils/files" });
//   });

//   afterEach(() => {
//     mock.restore();
//   })

//   test("Resolve a directory to a system path", () => {
//     // newFs.__setStats({ isDirectory: true, isFile: false });

//     const { resolveDirectory } = mock.bypass(() => require("../../../utils/files"));

//     const providePath = "configPath0";
//     const shouldBePath = resolveDirectory(providePath);

//     expect(shouldBePath).toEqual("/root/configPath0");
//   });


// });
