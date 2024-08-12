const Log = require('pino');
const Postgres = require('pg');
const Config = require('config');

const { isJust, isNothing, maybeToNullable } = require('sanctuary');

const { transactionalTest, thunk } = require('../../__fixtures__/db');

const { Authors } = require('../../__fixtures__');

const {
  getAuthorFromDatabaseById,
  getAuthorFromDatabaseByEmail,
} = require('../../../src/stories/db/getAuthorFromDatabase');

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
describe('getAuthorFromDatabaseById', () => {
  test('get an author who exists', () => {
    return transactionalTest(connect, async () => {
      const getAuthor = getAuthorFromDatabaseById(log, connect);

      const author = await getAuthor(Authors.UmbertoEco.id);

      expect(isJust(author)).toBe(true);
      expect(maybeToNullable(author)).toMatchObject(Authors.UmbertoEco);
    });
  });

  test("get an author who doesn't exist", () => {
    return transactionalTest(connect, async () => {
      const getAuthor = getAuthorFromDatabaseById(log, connect);

      const author = await getAuthor(50000);

      expect(isNothing(author)).toBe(true);
    });
  });
});

/**
 * @group integration
 * @group db
 */
describe('getAuthorFromDatabaseByEmail', () => {
  test('get an author who exists', () => {
    return transactionalTest(connect, async () => {
      const getAuthor = getAuthorFromDatabaseByEmail(log, connect);

      const author = await getAuthor(Authors.UmbertoEco.id);

      expect(isJust(author)).toBe(true);
      expect(maybeToNullable(author)).toMatchObject(Authors.UmbertoEco);
    });
  });

  test("get an author who doesn't exist", () => {
    return transactionalTest(connect, async () => {
      const getAuthor = getAuthorFromDatabaseByEmail(log, connect);

      const author = await getAuthor('bilbo@bag.end');

      expect(isNothing(author)).toBe(true);
    });
  });
});
