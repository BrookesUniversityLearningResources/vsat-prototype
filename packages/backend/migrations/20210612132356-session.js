'use strict';

exports.up = function (db, callback) {
  db.runSql(
    `
    CREATE TABLE "session"
     (
         "sid"    varchar      NOT NULL,
         "sess"   json         NOT NULL,
         "expire" timestamp(6) NOT NULL
     ) WITH (OIDS= FALSE);

    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

    CREATE INDEX "IDX_session_expire" ON "session" ("expire");
    `,
    callback
  );
};

exports.down = function (db, callback) {
  db.runSql(
    `
    DROP TABLE "session";

    DROP INDEX "IDX_session_expire";
    `,
    callback
  );
};

exports._meta = {
  version: 1,
};
