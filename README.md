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

### Services
Services used throughout the API  

| Method | Path | Description | Expected Output | Expected Body Input | Required Token
|-|-|-|-|-|-
*post* | /token | Admin/User | User login and token signing | { userName, pssword } | { token }

Tokens are valid for one hour and have to be included as a bearer token in the request header. After deployment, this route can be accessed with username *admin* and password *admin*. 

### Users
Endpoints for user data  

Method | Path | Token Type | Description | Expected Body Input | Expected Output
|-|-|-|-|-|-
*post* | /admin | Admin | Check for duplicate admin-level users, create a new admin user in db, hashes password | { userName, pssword } | { id, userName, role, dateCreated, deletedAt }
*post* | /users | None | Check for duplicate users, create a new user in db, hashes pssword | { userName, pssword } | { id, userName, dateCreated }
*get* | /users | Admin | Return all users as an array of objects | None | [ { id, userName, dateCreated, deletedAt, role, pssword }, ... ]
*get* | /users/:id | Admin/User | Return a user specified by id | None | { id, userName, dateCreated }
*put* | /users/:id | Admin | Update a user specified by id | At least one or any combination of { userName, deletedAt, role, pssword } | { id, userName, role, dateCreated, deletedAt }
*put* | /users/:id | User | Update a user specified by id. User must the user to whom the token was issued | At least one or any combination of { userName, pssword } | { id, userName, dateCreated }
*delete* | /users/:id | Admin/User | Soft delete a user specified by id | None | { id, userName, role, dateCreated, deletedAt }

To undelete a user with *.put(/users/:id)*, *deletedAt* must be specified as *false* in the body input.

The resource referenced by the route must be associated with the user to whom the User token was issued.

### Accounts
Endpoints for account data  

Method | Path | Token Type | Description | Expected Body Input | Expected Output
|-|-|-|-|-|-
*post* | /accounts | Admin/User | Add new account to db | { name, owner } | { id, name, owner, deletedAt, lastUpdated, balance }
*get* | /accounts | Admin | Return all accounts as an array of objects | None | [ { id, name, owner, deletedAt, lastUpdated }, ... ]
*get* | /accounts/?owner=[owner] | Admin/User | Return all accounts associated with specified owner as an array of objects | None | [ { id, name, owner, deletedAt, lastUpdated }, ... ]
*get* | /accounts/:id | Admin/User | Return an account specified by id | None | { id, name, owner, deletedAt, lastUpdated, balance }
*put* | /accounts/:id | Admin/User | Update an account specified by id | { name } | { id, name, owner, deletedAt, lastUpdated, balance }
*delete* | /accounts/:id | Admin/User | Soft delete an account specified by id | None | { id, name, owner, deletedAt, lastUpdated, balance }

The resource referenced by the route must be associated with the user to whom the User token was issued.

### Transactions
Endpoints for transaction data

Method | Path | Token Type | Description | Expected Body Input | Expected Output
-|-|-|-|-|-
*post* | /transactions | Admin/User | Add transaction | { debitAccountId, creditAccountId, amount } | { id, debitAccountId, creditAccountId, amount, date }
*get* | /transactions | Admin | Return all transactions as an array of objects | None | [ { id, debitAccountId, creditAccountId, amount, date }, ... ]
*get* | /transaction/?account=[account] | Admin/User | Return all transactions associated with specified account as an array of objects | None | [ { id, debitAccountId, creditAccountId, amount, date }, ... ]
*get* | /transactions/:id | Admin/User | Return transaction specified by id as an object | None | { id, debitAccountId, creditAccountId, amount, date }

To create a new transaction resource, the user to whom the User token was issued must be the owner of the account which will be debited. 

To read a transaction resource, the user to whom the User token was issued must be the owner of the account being referenced by the transaction. 

*TODO*

