'use strict';

function insertOneAuthor(db, callback) {
  return (name) =>
    db.runSql('INSERT INTO author (name) VALUES (?)', [name], callback);
}

function insertOneStory(db, callback) {
  return (title) =>
    db.runSql('INSERT INTO story (title) VALUES (?)', [title], callback);
}

function insertOneScene(db, callback) {
  return (title, storyId, content, isOpeningScene = false) =>
    db.runSql(
      `
      INSERT INTO scene
        (title, story_id, content, is_opening_scene)
      VALUES (?, ?, ?, ?)
      `,
      [title, storyId, content, isOpeningScene],
      callback
    );
}

function linkAuthorToStory(db, callback) {
  return (authorId, storyId) =>
    db.runSql(
      'INSERT INTO author_to_story (author_id, story_id) VALUES (?, ?)',
      [authorId, storyId],
      callback
    );
}

exports.up = function (db, callback) {
  const insertAuthor = insertOneAuthor(db, callback);
  const insertStory = insertOneStory(db, callback);
  const insertScene = insertOneScene(db, callback);
  const authoredBy = linkAuthorToStory(db, callback);

  insertAuthor('Angela Carter');
  insertAuthor('Elmore Leonard');
  insertAuthor('Ursula Le Guin'); // has written two stories
  insertAuthor('Boccaccio'); // has no stories :'(
  insertAuthor('Umberto Eco'); // co-author
  insertAuthor('Adso of Melk'); // co-author

  insertStory('The Bloody Chamber');
  insertStory('Out Of Sight');
  insertStory('The Lathe Of Heaven');
  insertStory('The Left Hand Of Darkness');
  insertStory('The Name Of The Rose');

  authoredBy(2, 1);
  authoredBy(3, 2);

  // Le Guin has authored two stories
  authoredBy(4, 3);
  authoredBy(4, 4);

  // "The Name Of The Rose" is co-authored
  authoredBy(6, 5);
  authoredBy(7, 5);

  insertScene(
    'Introduction',
    5,
    `# Introduction

I was handed a book
`,
    true
  );
  insertScene(
    'The Abbey',
    5,
    `# The Abbey

The abbey loomed in the distance
`
  );
};

exports.down = function (db, callback) {
  db.runSql('TRUNCATE author_to_story', callback);
  db.runSql('TRUNCATE scene RESTART IDENTITY;', callback);
  db.runSql('TRUNCATE story RESTART IDENTITY;', callback);
  db.runSql('TRUNCATE author RESTART IDENTITY;', callback);
  db.runSql('TRUNCATE image RESTART IDENTITY;', callback);
};

exports._meta = {
  version: 1,
};
