"use strict";

const fs = require("fs");
const path = require("path");

const format = require("js-beautify").js;
const createLogger = require("logging").default;

const logger = createLogger("Utility - Files");

function resolvePath(providedPath) {
  logger.debug("Determine if default");
  logger.debug(providedPath);

  if (!providedPath) return ".";
  return providedPath;
}

function resolveDirectoryPath(dirPath) {
  logger.debug("Resolving directory path");
  logger.debug(dirPath);

  return path.extname(dirPath) ? path.dirname(dirPath) : dirPath;
}

function resolveAbsolutePath(providedPath) {
  logger.debug("Resolve if absolute");
  logger.debug(providedPath);

  if (path.isAbsolute(providedPath)) {
    logger.debug("An absolute path");

    return providedPath;
  }
  logger.debug("Not absolute path");

  return `/${providedPath}`;
}

// resolves `path`, `/path`, `./path`
// returns `/_current/working/directory_/path`
function resolveSystemPath(fullPath) {
  logger.debug("Confirm system path");

  const stats = systemPath(fullPath);
  if (stats.isDirectory() || stats.isFile()) {
    return fullPath;
  }
  throw new Error(`Provided path was neither file nor directory [${fullPath}]`);
}

function systemPath(target, currentPath = process.cwd) {
  logger.debug("Get stats for target");
  try {
    return fs.lstatSync(target);
  } catch (error) {
    logger.debug(error);
  }

  // See if joining to current working directory helps
  try {
    const newPath = path.join(currentPath(), target);
    logger.debug(newPath);
    return fs.lstatSync(newPath);
  } catch (error) {
    logger.debug(error);
  }

  throw new Error(`Unable to resolve path to system [${target}]`);
}

module.exports = {
  resolveDirectory(configPath) {
    const starting = resolvePath(configPath);
    const directory = resolveDirectoryPath(starting);
    const fullPath = resolveAbsolutePath(directory);
    return resolveSystemPath(fullPath);
  },

  isFile(filePath) {
    logger.debug("Checking if file");
    logger.debug(filePath);

    try {
      const filestat = fs.statSync(filePath);
      // if (!filestat) return false;
      return filestat.isFile();
    } catch (error) {
      if (error.code === "ENOENT") return false;
    }
  },

  getFileContents(file) {
    return fs.readFileSync(file, "utf8");
  },

  beautify(code) {
    // eslint-disable-next-line camelcase
    return format(code, { indent_size: 2, space_in_empty_paren: true });
  },
};
