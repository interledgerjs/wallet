# A demo ILP wallet

> **This project is being built by the interns at Coil and is NOT ready to use. We'll make a release as soon as it is.**

[![CircleCI](https://circleci.com/gh/interledgerjs/wallet.svg?style=shield)](https://circleci.com/gh/interledgerjs/wallet)
[![codecov](https://codecov.io/gh/interledgerjs/wallet/branch/master/graph/badge.svg)](https://codecov.io/gh/interledgerjs/wallet)

> If there are features you think are important feel free to log issues that will help us practice our agile workflow and product management.

## Goal

A working REST API that exposes the functions of simple wallet system (accounts, users, transactions etc) and integrates the functions required of an ILSP or wallet that can peer with connectors on the Interledger.

### Folders

All source code is expected to be TypeScript and is placed in the `src` folder. Tests are put in the `test` folder.

The NPM package will not contain any TypeScript files (`*.ts`) but will have typings and source maps.

### Environmental variables
The environmental variable file, in the root folder, is used to store and configure variables for database management, development and deployment. This repo is supplied with an `example.env`.

Please change the example variables to suit your needs.

## Scripts

  - `clean` : Cleans the build folder and test output
  - `build` : Build the project
  - `lint`  : Run the linter over the project
  - `test`  : Run the unit tests and produce a code coverage report
  - `loadtest` : Run the loadtest and produces an artillery report afterwards
  - `docs`   : Build the docs
  - `consolelog`  : will show Winston logging for debugging

## Endpoints

### Users
Endpoints for user data  

|  | Path | Description | Expected Output | Expected Body Input |
|--------|-----------------------------|---------------------------------------------------------------------|------------------------------------------------------------------|-------------------------------------------------------------|
| *post* | /admin | Check for duplicate admin-level users, create a new admin user in db, hashes pssword | 200 | { userName, pssword } |
| *post* | /users | Check for duplicate users, create a new user in db, hashes pssword | 200 | { userName, pssword } |
| *get* | /users | Return all users as an array of objects | [ { id, userName, dateCreated, deletedAt, role, pssword }, ... ] | None |
| *get* | /users/?id=[id] | Return a user specified by id | { id, userName, dateCreated, deletedAt, role, pssword } | None |
| *get* | /users/?username=[username] | Return a user specified by username | { id, userName, dateCreated, deletedAt, role, pssword } | None |
| *put* | /user/:id | Update a user specified by id | 200 | At least one: { userName, dateCreated, deletedAt, pssword } |
| *delete* | /user/:id | Soft delete a user specified by id | 200 | None |

### Accounts
Endpoints for account data  

|  | Path | Description | Expected Output | Expected Body Input |
|--------|--------------------------|----------------------------------------------------------------------------|---------------------------------------------------------------|----------------------------------------|
| *post* | /accounts | Add new account to db | 200 | { name, owner} |
| *get* | /accounts | Return all accounts as an array of objects |  [ { id, name, owner, balance, deletedAt, lastUpdated }, … ] | None |
| *get* | /accounts/?id=[id] | Return an account specified by id | { id, name, owner, balance, deletedAt, lastUpdated } | None |
| *get* | /accounts/?owner=[owner] | Return all accounts associated with specified owner as an array of objects | [ { id, name, owner, balance, deletedAt, lastUpdated }, ... ] | None |
| *put* | /accounts/:id | Update an account specified by id | 200 | At least one: { name, owner, balance } |
| *delete* | /accounts/:id | Soft delete an account specified by id | 200 | None |

### Transactions
Endpoints for transaction data

*TODO*

### Services
Services used throughout the API  

|  | Path | Description | Expected Output | Expected Body Input |
|------|--------|------------------------------|-----------------|-----------------------|
| *post* | /token | User login and token signing | { token } | { username, pssword } |