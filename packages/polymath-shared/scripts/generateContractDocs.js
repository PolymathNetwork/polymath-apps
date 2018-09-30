/**
 * Author: @RafaelVidaurre
 *
 * Quick script to generate documentation boilerplate for Contracts
 * from JSON artifacts.
 *
 * This script uses the `contractDocs.config.js` file available
 * in the workspace's config directory to generate the markdown file
 */
const path = require('path');
const _ = require('lodash');
const fs = require('fs');

const configFilePath = path.join(
  __dirname,
  '../../../config/contractDocs.config'
);
const contractArtifactsPath = path.join(__dirname, '../src/fixtures/contracts');
const config = require(configFilePath);

const contracts = {};

_.each(config.contracts, (contractConfig, contractName) => {
  const artifactPath = path.join(contractArtifactsPath, contractName);
  contracts[contractName] = {
    artifact: require(artifactPath),
    config: contractConfig,
  };
});

const contractAbiToMarkdown = require('./contractAbiToMarkdown');

const results = _.map(contracts, contract =>
  contractAbiToMarkdown(contract.artifact, contract.config)
).join('\n\n');

fs.writeFileSync('./Contracts.md', results);
