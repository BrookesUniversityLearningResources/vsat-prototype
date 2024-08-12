const Log = require('pino');
const Postgres = require('pg');
const Config = require('config');

const { isJust, isNothing, maybeToNullable } = require('sanctuary');

const { transactionalTest, thunk } = require('../../__fixtures__/db');

const { Authors, Stories } = require('../../__fixtures__');

const {
  getStoriesByAuthorFromDatabase,
} = require('../../../src/stories/db/getStoriesByAuthorFromDatabase');

const log = Log(Config.get('log'));

/**
 * @group integration
 * @group db
 */
describe('querying the DB for stories by an author', function () {
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

  test(
    'given an author who has written two stories the function' +
      ' returns Just a list of the IDs and titles of both of those stories' +
      " and the author's ID and name",
    () => {
      return transactionalTest(connect, async () => {
        const getStoriesByAuthor = getStoriesByAuthorFromDatabase(log, connect);

        const data = await getStoriesByAuthor(Authors.UrsulaLeGuin.id);

        expect(isJust(data)).toBe(true);
        expect(maybeToNullable(data)).toEqual({
          author: {
            id: Authors.UrsulaLeGuin.id,
            name: Authors.UrsulaLeGuin.name,
          },
          stories: [
            {
              id: Stories.TheLatheOfHeaven.id,
              title: Stories.TheLatheOfHeaven.title,
              published: false,
            },
            {
              id: Stories.TheLeftHandOfDarkness.id,
              title: Stories.TheLeftHandOfDarkness.title,
              published: false,
            },
          ],
        });
      });
    }
  );

  test(
    'given an author who has written one story the query' +
      ' returns Just a list of the IDs and titles of both of those stories' +
      " and the author's ID and name",
    () => {
      return transactionalTest(connect, async () => {
        const getStoriesByAuthor = getStoriesByAuthorFromDatabase(log, connect);

        const data = await getStoriesByAuthor(Authors.AngelaCarter.id);

        expect(isJust(data)).toBe(true);
        expect(maybeToNullable(data)).toEqual({
          author: {
            id: Authors.AngelaCarter.id,
            name: Authors.AngelaCarter.name,
          },
          stories: [
            {
              id: Stories.TheBloodyChamber.id,
              title: Stories.TheBloodyChamber.title,
              published: false,
            },
          ],
        });
      });
    }
  );

  test(
    'given an author who has written no stories' +
      ' returns Just an empty list of stories' +
      " and the author's ID and name",
    () => {
      return transactionalTest(connect, async () => {
        const getStoriesByAuthor = getStoriesByAuthorFromDatabase(log, connect);

        const data = await getStoriesByAuthor(Authors.Boccaccio.id);

        expect(isJust(data)).toBe(true);
        expect(maybeToNullable(data)).toEqual({
          author: Authors.Boccaccio,
          stories: [],
        });
      });
    }
  );

  test("given an author who doesn't exist results in Nothing", () => {
    return transactionalTest(connect, async () => {
      const getStoriesByAuthor = getStoriesByAuthorFromDatabase(log, connect);

      const stories = await getStoriesByAuthor(55162);

      expect(isNothing(stories)).toBe(true);
    });
  });
});
