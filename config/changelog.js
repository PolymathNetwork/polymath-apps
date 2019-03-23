const conventionalChangelogCore = require('conventional-changelog-core');
const preset = require('conventional-changelog-angular');
const fs = require('fs');
const wstream = fs.createWriteStream('CHANGELOG.md');

// NOTE @RafaelVidaurre: This is not a finished utility. Use carefully
conventionalChangelogCore(
  { config: preset },
  {},
  {
    from: 'v0.1.0',
  }
).pipe(wstream);
