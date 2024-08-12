const Log = require('pino');
const Postgres = require('pg');
const Config = require('config');

const { transactionalTest, thunk } = require('../../__fixtures__/db');

const { Authors } = require('../../__fixtures__');

const {
  saveStoryToDatabase,
} = require('../../../src/stories/db/saveStoryToDatabase');

const log = Log(Config.get('log'));

let pool;
let connect;

beforeAll(() => {
  pool = new Postgres.Pool({
    max: 1,
    connectionString: Config.get('db.connectionString'),
  });
  connect = thunk(pool.connect());
});

afterAll((done) => {
  return connect()
    .then((connection) => connection.release())
    .then(() => pool.end())
    .finally(done);
});

/**
 * @group integration
 * @group db
 */
describe('saveStoryToDatabase', () => {
  test(
    'saving a new story written by an existing author' +
      ' inserts it into the DB',
    () => {
      return transactionalTest(connect, async () => {
        const save = saveStoryToDatabase(log, connect);

        const story = {
          title: 'Rum Punch',
          authors: [Authors.ElmoreLeonard],
          scenes: [],
        };

        const savedStory = await save(story);

        expect(savedStory.id).toBeDefined();
        expect(savedStory).toMatchObject({
          title: 'Rum Punch',
          authors: [Authors.ElmoreLeonard],
          scenes: [],
        });
      });
    }
  );

  test(
    'saving a new story written by two existing authors' +
      ' inserts it into the DB',
    () => {
      return transactionalTest(connect, async () => {
        const save = saveStoryToDatabase(log, connect);

        const story = {
          title: 'Rum Punch',
          authors: [Authors.ElmoreLeonard, Authors.UrsulaLeGuin],
          scenes: [],
        };

        const savedStory = await save(story);

        expect(savedStory).toMatchObject({
          title: 'Rum Punch',
          authors: [Authors.ElmoreLeonard, Authors.UrsulaLeGuin],
          scenes: [],
        });
        expect(savedStory.id).toBeDefined();
      });
    }
  );

  test(
    'saving a new story written by a new author' +
      ' inserts both author, story, and scenes into the DB',
    () => {
      return transactionalTest(connect, async () => {
        const save = saveStoryToDatabase(log, connect);

        const story = {
          title: 'Parsival',
          authors: [
            {
              name: 'Richard Monaco',
            },
          ],
          scenes: [
            {
              title: 'Parsival Encounters The Red Knight',
              content: '# Lorem\n\n' + 'Lorem ipsum dolor sit amet',
            },
            {
              title: 'Broaditch On The Road',
              content:
                'The Serfs\n\n' +
                'The serfs Broaditch and Waleis were in the mood for love.',
              isOpeningScene: true,
            },
          ],
        };

        const savedStory = await save(story);

        expect(savedStory).toMatchObject({
          title: 'Parsival',
          authors: [
            {
              name: 'Richard Monaco',
            },
          ],
          scenes: [
            {
              title: 'Parsival Encounters The Red Knight',
              content: '# Lorem\n\n' + 'Lorem ipsum dolor sit amet',
              isOpeningScene: false,
            },
            {
              title: 'Broaditch On The Road',
              content:
                'The Serfs\n\n' +
                'The serfs Broaditch and Waleis were in the mood for love.',
              isOpeningScene: true,
            },
          ],
        });

        // ids must have been assigned and folded into the story
        expect(savedStory.id).toBeDefined();
        expect(savedStory.authors[0].id).toBeDefined();
        expect(savedStory.scenes[0].id).toBeDefined();
        expect(savedStory.scenes[1].id).toBeDefined();
      });
    }
  );
});
