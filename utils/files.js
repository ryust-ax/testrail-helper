"use strict";

const fs = require("fs");
const path = require("path");

const format = require("js-beautify").js;
const createLogger = require("logging").default;

const logger = createLogger("Utility - Files");

function resolvePath(providedPath) {
  logger.debug("Determine if default");
  logger.debug(providedPath);

  if (!providedPath) {
    logger.debug(".");
    return ".";
  }
  logger.debug(providedPath);
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
function resolveSystemPath(target, currentPath = process.cwd) {
  logger.debug("Confirm system path");

  const stats = checkSystem(target);
  if (stats && (stats.isDirectory() || stats.isFile())) {
    logger.debug(`Path exists [${target}]`);
    return target;
  }

  // See if joining to current working directory helps
  const newPath = path.join(currentPath(), target);
  logger.debug(`Build Path [${newPath}]`);

  const retryStats = checkSystem(newPath);
  if (retryStats && (retryStats.isDirectory() || retryStats.isFile())) {
    logger.debug(`Path exists [${newPath}]`);
    return newPath;
  }

  throw new Error(`Unable to resolve to system [${target}] or [${newPath}]`);
}

function checkSystem(target) {
  logger.debug("Get stats for target");
  try {
    return fs.lstatSync(target);
  } catch (error) {
    logger.debug(error);
  }
}

module.exports = {
  resolveDirectory(configPath) {
    logger.debug(`Resolving directory [${configPath}]`);
    const starting = resolvePath(configPath);
    const directory = resolveDirectoryPath(starting);
    const fullPath = resolveAbsolutePath(directory);
    return resolveSystemPath(fullPath);
  },

  resolveFile(configPath) {
    logger.debug(`Resolving file [${configPath}]`);
    const starting = resolvePath(configPath);
    const fullPath = resolveAbsolutePath(starting);
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
