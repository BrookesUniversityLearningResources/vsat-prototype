'use strict';

exports.up = function (db, callback) {
  db.runSql(
    `UPDATE author SET email = 'oxbuildingbridges@gmail.com'`,
    callback
  );
};

exports.down = function (db, callback) {
  db.runSql(`UPDATE author SET email = ''`, callback);
};

exports._meta = {
  version: 1,
};
