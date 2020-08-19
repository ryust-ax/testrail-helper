const fs = require("fs");
const path = require("path");
const format = require("js-beautify").js;

module.exports = {
  getTestRoot: function (currentPath) {
    if (!currentPath) currentPath = ".";
    if (!path.isAbsolute(currentPath)) currentPath = path.join(process.cwd(), currentPath);
    currentPath = fs.lstatSync(currentPath).isDirectory() || !path.extname(currentPath) ? currentPath : path.dirname(currentPath);
    return currentPath;
  },

  fileExists: function (filePath) {
    try {
      fs.statSync(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') return false;
    }
    return true;
  },

  isFile: function (filePath) {
    let filestat;
    try {
      filestat = fs.statSync(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') return false;
    }
    if (!filestat) return false;
    return filestat.isFile();
  },

  beautify: function (code) {
    return format(code, { indent_size: 2, space_in_empty_paren: true });
  },
}
