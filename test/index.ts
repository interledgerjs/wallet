import 'mocha'
import * as app from '../build/app'
import * as sinon from 'sinon'
import * as Chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
Chai.use(chaiAsPromised)
const assert = Object.assign(Chai.assert, sinon.assert)
require('source-map-support').install()
import expect from "expect";
import request from "supertest";

