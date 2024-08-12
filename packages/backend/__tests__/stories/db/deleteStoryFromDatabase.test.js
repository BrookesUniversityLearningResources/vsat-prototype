const Log = require('pino');
const Postgres = require('pg');
const Config = require('config');

const {
  transactionalTest,
  thunk,
  releaseConnectionAndClosePool,
} = require('../../__fixtures__/db');

const { Authors } = require('../../__fixtures__');

const {
  saveStoryToDatabase,
} = require('../../../src/stories/db/saveStoryToDatabase');

const {
  deleteStoryFromDatabase,
} = require('../../../src/stories/db/deleteStoryFromDatabase');

const log = Log(Config.get('log'));

const pool = new Postgres.Pool({
  max: 1,
  connectionString: Config.get('db.connectionString'),
});
const connect = thunk(pool.connect());

afterAll(releaseConnectionAndClosePool(connect, pool));

/**
 * @group integration
 * @group db
 */
describe('deleteStoryFromDatabase', () => {
  test(
    'deleting a story written by an existing author' +
      ' removes it from the DB',
    () => {
      return transactionalTest(connect, async () => {
        const story = {
          title: 'A Void',
          authors: [Authors.ElmoreLeonard],
          scenes: [
            {
              title: 'Introduction',
              content: '# Lorem\n\n' + 'Lorem ipsum dolor sit amet',
            },
          ],
        };

        const savedStory = await saveStoryToDatabase(log, connect)(story);

        await deleteStoryFromDatabase(log, connect)(savedStory.id);
      });
    }
  );
});
