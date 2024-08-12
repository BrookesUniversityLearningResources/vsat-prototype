const Log = require('pino');
const Postgres = require('pg');
const Config = require('config');

const { maybeToNullable } = require('sanctuary');

const { transactionalTest, thunk } = require('../../__fixtures__/db');

const { Stories } = require('../../__fixtures__');

const {
  saveStoryTitleToDatabase,
} = require('../../../src/stories/db/saveStoryTitleToDatabase');

const {
  getStoryFromDatabase,
} = require('../../../src/stories/db/getStoryFromDatabase');

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
describe('saveStoryTitleToDatabase', () => {
  test('update the title of an existing story', () => {
    return transactionalTest(connect, async () => {
      const saveTitle = saveStoryTitleToDatabase(log, connect);
      const getStory = getStoryFromDatabase(log, connect);

      const storyId = Stories.TheBloodyChamber.id;

      await saveTitle({
        storyId,
        title: 'Seven Easy Pieces',
      });

      const story = await getStory(storyId);

      expect(maybeToNullable(story).title).toEqual('Seven Easy Pieces');
    });
  });
});
