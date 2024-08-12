const Log = require('pino');
const Postgres = require('pg');
const Config = require('config');

const { isJust, isNothing, maybeToNullable } = require('sanctuary');

const { transactionalTest, thunk } = require('../../__fixtures__/db');

const { Authors, Stories } = require('../../__fixtures__');

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
describe('getStoryFromDatabase', () => {
  test('get a story that exists', () => {
    return transactionalTest(connect, async () => {
      const getStory = getStoryFromDatabase(log, connect);

      const story = await getStory(Stories.TheNameOfTheRose.id);

      expect(isJust(story)).toBe(true);
      expect(maybeToNullable(story)).toMatchObject({
        title: 'The Name Of The Rose',
        authors: [Authors.AdsoOfMelk, Authors.UmbertoEco],
      });
    });
  });

  test("get a story that doesn't exist", () => {
    return transactionalTest(connect, async () => {
      const getStory = getStoryFromDatabase(log, connect);

      const story = await getStory(50000);

      expect(isNothing(story)).toBe(true);
    });
  });
});
