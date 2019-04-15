# Frontend Test Framework

This test framework is wrapped around Test Cafe and is aimed at providing helper functions when dealing with the myriad of functionality
that is repeated along the apps from this project.

To get to know more about Test Cafe you can follow this [getting started guide](https://devexpress.github.io/testcafe/documentation/getting-started/).

## Configuration

In order to run this you need to execute `yarn test` and pinpoint at the files you want to run using `--src`.
This package will automatically download and install metamask, but should you want to use an unzipped version without download and repackaging you can use `--metamaskPath` and that one will be used.

Currently only Chrome is supported.
