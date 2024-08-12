const run = require('execa');
const Config = require('config');

// slice off the `node` and file path arguments
const argv = require('minimist')(process.argv.slice(2));

function databaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const db = Config.get('db');

  if (db.connectionString) {
    return db.connectionString;
  }

  if (
    !(db.driver && db.user && db.password && db.host && db.port && db.database)
  ) {
    throw new Error(
      "Can't figure out the URL of the database to connect to;" +
        ' check that either the DATABASE_URL environment variable is set' +
        ' or that the NODE_ENV environment variable is set' +
        ' and the "db" object in /config is configured appropriately.'
    );
  }

  return `${db.driver}://${db.user}:${db.password}@${db.host}:${db.port}/${db.database}`;
}

(() => {
  const migrate = run('db-migrate', argv._, {
    env: {
      DATABASE_URL: databaseUrl(),
    },
  });
  migrate.stdout.pipe(process.stdout);
  return migrate.catch((err) => {
    console.error(err);
    process.exit(1);
  });
})();
