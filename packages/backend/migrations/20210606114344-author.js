'use strict';

exports.up = function (db, callback) {
  db.runSql(
    `
     ALTER TABLE author
       ADD COLUMN email varchar(100) DEFAULT ''
    `,
    callback
  );
};

exports.down = function (db, callback) {
  db.runSql(
    `
     ALTER TABLE author
       DROP COLUMN email
    `,
    callback
  );
};

exports._meta = {
  version: 1,
};
