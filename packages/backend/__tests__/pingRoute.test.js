const path = require('path');

const request = require('supertest');
const HttpStatus = require('http-status-codes');
const { pingRoute } = require('../src/pingRoute');

const { createExpressApplication } = require('../src/app');

const { log } = require('./__mocks__/log.js');

/**
 * @group integration
 * @group web
 */
test('/ping', (done) => {
  request(
    createExpressApplication(log, [pingRoute({})], path.join(__dirname, '..'))
  )
    .get('/ping')
    .expect('Content-Type', /json/)
    .expect(HttpStatus.OK, done);
});
