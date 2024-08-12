const path = require('path');

const request = require('supertest');
const HttpStatus = require('http-status-codes');

const { createExpressApplication } = require('../../src/app');
const { createRoutes } = require('../../src/dependencies');

const { Authors, Stories } = require('../__fixtures__');

const { log } = require('../__mocks__/log.js');

/**
 * @group integration
 * @group web
 */
describe('save a story', () => {
  const app = request(
    createExpressApplication(
      log,
      [createRoutes(log)],
      path.join(__dirname, '..')
    )
  );

  test('that exists is a 200 OK', (done) => {
    const storyId = Stories.TheNameOfTheRose.id;

    const theStorySent = {
      id: storyId,
      authors: [Authors.UmbertoEco, Authors.AdsoOfMelk],
      title: 'The Name Of The Rose',
      scenes: [
        {
          id: 1,
          storyId: storyId,
          title: 'Introduction',
          content: '# Introduction\n\nI was handed a book\n',
          isOpeningScene: true,
        },
        {
          id: 2,
          storyId: storyId,
          title: 'The Abbey',
          content: '# The abbey\n\nThe abbey loomed in the distance',
        },
      ],
    };

    app
      .put(`/api/story/${storyId}`)
      .send(theStorySent)
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK, done);
  });

  test.each(['wut', '-1', '0'])(
    'using the invalid story ID `%s` is a 400 BAD REQUEST',
    (id, done) => {
      app.get(`/api/story/${id}`).expect(HttpStatus.BAD_REQUEST, done);
    }
  );
});
