const Log = require('pino');
const Postgres = require('pg');
const Config = require('config');

const { maybeToNullable } = require('sanctuary');

const { transactionalTest, thunk } = require('../../__fixtures__/db');

const { Stories } = require('../../__fixtures__');

const {
  publishStoryToDatabase,
} = require('../../../src/stories/db/publishStoryToDatabase');

const {
  unpublishStoryToDatabase,
} = require('../../../src/stories/db/unpublishStoryToDatabase');

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
describe('publishStoryToDatabase', () => {
  test('publishing an unpublished story marks it as published', () => {
    return transactionalTest(connect, async () => {
      const publishStory = publishStoryToDatabase(log, connect);
      const getStory = getStoryFromDatabase(log, connect);

      const storyId = Stories.TheBloodyChamber.id;

      await publishStory(storyId);

      const story = await getStory(storyId);

      expect(maybeToNullable(story).published).toEqual(true);
    });
  });

  test('publishing a published story leaves it as published', () => {
    return transactionalTest(connect, async () => {
      const publishStory = publishStoryToDatabase(log, connect);
      const getStory = getStoryFromDatabase(log, connect);

      const storyId = Stories.TheBloodyChamber.id;

      await publishStory(storyId);

      const story = await getStory(storyId);

      expect(maybeToNullable(story).published).toEqual(true);

      await publishStory(storyId);

      const republishedStory = await getStory(storyId);

      expect(maybeToNullable(republishedStory).published).toEqual(true);
    });
  });

  test('unpublishing a published story marks it as unpublished', () => {
    return transactionalTest(connect, async () => {
      const publishStory = publishStoryToDatabase(log, connect);
      const unpublishStory = unpublishStoryToDatabase(log, connect);
      const getStory = getStoryFromDatabase(log, connect);

      const storyId = Stories.TheBloodyChamber.id;

      await publishStory(storyId);
      const publishedStory = await getStory(storyId);
      expect(maybeToNullable(publishedStory).published).toEqual(true);

      await unpublishStory(storyId);
      const unpublishedStory = await getStory(storyId);
      expect(maybeToNullable(unpublishedStory).published).toEqual(false);
    });
  });
});
