'use strict';

exports.up = function (db, callback) {
  db.runSql(
    `
     ALTER TABLE author
       DROP CONSTRAINT author_name_key
    `,
    callback
  );
};

exports.down = function (db, callback) {};

exports._meta = {
  version: 1,
};
