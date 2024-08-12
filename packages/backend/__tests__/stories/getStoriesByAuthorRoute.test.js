const path = require('path');

const request = require('supertest');
const HttpStatus = require('http-status-codes');

const { createExpressApplication } = require('../../src/app');
const { createRoutes } = require('../../src/dependencies');

const { Authors } = require('../__fixtures__');

const { log } = require('../__mocks__/log.js');

/**
 * @group integration
 * @group web
 */
describe('get stories for an author', () => {
  const app = request(
    createExpressApplication(
      log,
      [createRoutes(log)],
      path.join(__dirname, '..')
    )
  );

  test('that has written one story is a 200 OK', (done) => {
    app
      .get(`/api/author/${Authors.AngelaCarter.id}/stories`)
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK, done);
  });

  test("who hasn't written any stories is a 200 OK with an empty array of stories", (done) => {
    app
      .get(`/api/author/${Authors.Boccaccio.id}/stories`)
      .expect('Content-Type', /json/)
      .expect(
        HttpStatus.OK,
        {
          author: Authors.Boccaccio,
          stories: [],
        },
        done
      );
  });

  test("who doesn't exist is a 400 NOT FOUND", (done) => {
    app.get('/api/author/50001/stories').expect(HttpStatus.NOT_FOUND, done);
  });

  test.each(['wut', '-1', '0'])(
    'using the invalid author ID `%s` is a 400 BAD REQUEST',
    (id, done) => {
      app
        .get(`/api/author/${id}/stories`)
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST, done);
    }
  );
});
