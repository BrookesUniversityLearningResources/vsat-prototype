'use strict';

function updateAuthorEmail(db, callback) {
  return (id, email) =>
    db.runSql(
      'UPDATE author SET email = ? WHERE id = ?',
      [email, id],
      callback
    );
}

exports.up = function (db, callback) {
  const updateEmail = updateAuthorEmail(db, callback);

  updateEmail(1, 'telegraph@plantfan');
  updateEmail(2, 'angela@carter');
  updateEmail(3, 'elmore@leonard');
  updateEmail(4, 'ursula@leguin');
  updateEmail(5, 'bocac@cio');
  updateEmail(6, 'umberto@eco');
  updateEmail(7, 'adso@melk');
};

exports.down = function (db, callback) {};

exports._meta = {
  version: 1,
};
