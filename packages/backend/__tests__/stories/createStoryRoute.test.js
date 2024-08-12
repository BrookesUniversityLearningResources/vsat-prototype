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
describe('create a new story', () => {
  const app = request(
    createExpressApplication(
      log,
      [createRoutes(log)],
      path.join(__dirname, '..')
    )
  );

  test('with no explicit title by an existing author is a 201 CREATED', (done) => {
    app
      .post(`/api/author/${Authors.UmbertoEco.id}/story`)
      .expect('Content-Type', /json/)
      .expect('Location', new RegExp(`/api/story/\\d+`))
      .expect(HttpStatus.CREATED, done);
  });

  test('with an explicit title by an existing author is a 201 CREATED', (done) => {
    app
      .post(`/api/author/${Authors.UmbertoEco.id}/story`)
      .send({ title: 'Innocence' })
      .expect('Content-Type', /json/)
      .expect('Location', new RegExp(`/api/story/\\d+`))
      .expect(HttpStatus.CREATED, done);
  });

  test.each(['wut', '-1', '0'])(
    'using the invalid author ID `%s` is a 400 BAD REQUEST',
    (id, done) => {
      app.post(`/api/author/${id}/story`).expect(HttpStatus.BAD_REQUEST, done);
    }
  );
});
