const createLogger = require("logging").default;
const logger = createLogger("Mock - FS");

const mockfs = require("mock-fs");

logger.debug(mockfs);

const container = {
  __internalFs: null,
  __configureFs: (conf) => {
    container.__internalFs = mockfs(conf);
  },
  __mockFile: mockfs.file,
  __mockDirectory: mockfs.directory,
  __mockSymlink: mockfs.symlink,
};

const proxyfs = new Proxy(container, {
  get: function (target, property, receiver) {
    if (target.hasOwnProperty(property)) {
      return target[property];
    } else {
      if (target.__internalFs === null) {
        target.internalFs = mockfs();
      }
      return target.__internalFs[property];
    }
  }
});

module.exports = proxyfs;
