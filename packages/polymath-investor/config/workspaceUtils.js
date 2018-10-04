/**
 * Copyright (c) 2018-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Taken from https://github.com/facebook/create-react-app/blob/2c34d5b66eab7d1c96e573bc48b8e82b6d8e82b0/packages/react-dev-utils/workspaceUtils.js
const fs = require('fs');
const path = require('path');
const findPkg = require('find-pkg');
const globby = require('globby');

const findPkgs = (rootPath, globPatterns) => {
  if (!globPatterns) {
    return [];
  }
  const globOpts = {
    cwd: rootPath,
    strict: true,
    absolute: true,
  };
  return globPatterns
    .reduce(
      (pkgs, pattern) =>
        pkgs.concat(globby.sync(path.join(pattern, 'package.json'), globOpts)),
      []
    )
    .map(f => path.dirname(path.normalize(f)));
};

const findMonorepo = appDir => {
  const monoPkgPath = findPkg.sync(path.resolve(appDir, '..'));
  const monoPkg = monoPkgPath && require(monoPkgPath);
  const patterns = monoPkg && monoPkg.workspaces;
  const isYarnWs = Boolean(patterns);
  const allPkgs = patterns && findPkgs(path.dirname(monoPkgPath), patterns);
  const isIncluded = dir => allPkgs && allPkgs.indexOf(dir) !== -1;
  const isAppIncluded = isIncluded(appDir);
  const pkgs = allPkgs
    ? allPkgs.filter(f => fs.realpathSync(f) !== appDir)
    : [];

  return {
    isAppIncluded,
    isYarnWs,
    pkgs,
  };
};

module.exports = {
  findMonorepo,
};
