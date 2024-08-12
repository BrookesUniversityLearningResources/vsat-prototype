'use strict';

const fixedAuthorName = 'Telegraph PF';

exports.up = function (db, callback) {
  db.runSql(
    'INSERT INTO author (name) VALUES (?)',
    [fixedAuthorName],
    callback
  );
};

exports.down = function (db, callback) {
  db.runSql(
    `DELETE FROM author_to_story
     WHERE author_id = (
         SELECT author.id FROM author WHERE author.name = ?
     )`,
    [fixedAuthorName],
    callback
  );
  db.runSql('DELETE FROM author WHERE name = ?', [fixedAuthorName], callback);
};

exports._meta = {
  version: 1,
};
