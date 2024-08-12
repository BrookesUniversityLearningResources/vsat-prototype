'use strict';

exports.up = function (db, callback) {
  db.createTable(
    'author',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: 'string',
        notNull: true,
        unique: true,
        length: 100,
      },
    },
    callback
  );

  db.createTable(
    'story',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: 'string',
        notNull: true,
        length: 255,
      },
      published: {
        type: 'boolean',
        notNull: true,
        defaultValue: false,
      },
    },
    callback
  );

  db.createTable(
    'author_to_story',
    {
      author_id: {
        type: 'int',
        unsigned: true,
        notNull: true,
        primaryKey: true,
        foreignKey: {
          name: 'author_to_story_to_author_fk',
          table: 'author',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      story_id: {
        type: 'int',
        unsigned: true,
        notNull: true,
        primaryKey: true,
        foreignKey: {
          name: 'author_to_story_to_story_fk',
          table: 'story',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
    },
    callback
  );

  db.createTable(
    'image',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: 'string',
        notNull: true,
        length: 255,
      },
      thumbnail_url: {
        type: 'string',
        notNull: true,
        length: 255,
      },
    },
    callback
  );

  db.createTable(
    'audio',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: 'string',
        notNull: true,
        length: 255,
      },
    },
    callback
  );

  db.createTable(
    'scene',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: 'string',
        notNull: true,
        length: 255,
      },
      content: {
        type: 'text',
        notNull: true,
      },
      is_opening_scene: {
        type: 'boolean',
        notNull: true,
        defaultValue: false,
      },
      story_id: {
        type: 'int',
        unsigned: true,
        notNull: true,
        foreignKey: {
          name: 'scene_to_story_fk',
          table: 'story',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      image_id: {
        type: 'int',
        unsigned: true,
        notNull: false,
        foreignKey: {
          name: 'scene_to_image_fk',
          table: 'image',
          mapping: 'id',
        },
      },
      audio_id: {
        type: 'int',
        unsigned: true,
        notNull: false,
        foreignKey: {
          name: 'scene_to_audio_fk',
          table: 'audio',
          mapping: 'id',
        },
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('author_to_story', callback);
  db.dropTable('scene', callback);
  db.dropTable('image', callback);
  db.dropTable('audio', callback);
  db.dropTable('story', callback);
  db.dropTable('author', callback);
};

exports._meta = {
  version: 1,
};
