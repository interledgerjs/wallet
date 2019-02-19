# A demo ILP wallet

> **This project is being built by the interns at Coil and is NOT ready to use. We'll make a release as soon as it is.**

> If there are features you think are important feel free to log issues that will help us practice our agile workflow and product management.

## Goal

A working REST API that exposes the functions of simple wallet system (accounts, users, transactions etc) and integrates the functions required of an ILSP or wallet that can peer with connectors on the Interledger.

### Folders

All source code is expected to be TypeScript and is placed in the `src` folder. Tests are put in the `test` folder.

The NPM package will not contain any TypeScript files (`*.ts`) but will have typings and source maps.

### Scripts

  - `clean` : Cleans the build folder and test output
  - `build` : Build the project
  - `lint`  : Run the linter over the project
  - `test`  : Run the unit tests and produce a code coverage report
  - `doc`   : Build the docs