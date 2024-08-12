const path = require('path');

const request = require('supertest');
const HttpStatus = require('http-status-codes');

const { createExpressApplication } = require('../../src/app');
const { createRoutes } = require('../../src/dependencies');

const { Stories } = require('../__fixtures__');

const { log } = require('../__mocks__/log.js');

/**
 * @group integration
 * @group web
 */
describe('get a story', () => {
  const app = request(
    createExpressApplication(
      log,
      [createRoutes(log)],
      path.join(__dirname, '..')
    )
  );

  test('that exists is a 200 OK', (done) => {
    app
      .get(`/api/story/${Stories.TheNameOfTheRose.id}`)
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK, done);
  });

  test("that doesn't exist is a 404 NOT FOUND", (done) => {
    app
      .get('/api/story/50000')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.NOT_FOUND, done);
  });

  test.each(['wut', '-1', '0'])(
    'using the invalid story ID `%s` is a 400 BAD REQUEST',
    (id, done) => {
      app
        .get(`/api/story/${id}`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST, done);
    }
  );
});
