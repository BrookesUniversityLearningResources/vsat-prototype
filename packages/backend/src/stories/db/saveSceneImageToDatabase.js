const { tap } = require('ramda');

function saveSceneImageToDatabase(log, connect) {
  const saveImage = saveImageToDatabase(log, connect);

  const updateSceneImage = (sceneId, imageId) => ({
    name: 'updateSceneImage',
    text: `
      UPDATE scene
      SET image_id = $2
      WHERE id = $1
      RETURNING id
    `,
    values: [sceneId, imageId],
  });

  return (sceneId, image) => {
    log.debug({ sceneId, image }, 'Saving scene image to DB');

    return saveImage(image).then((image) =>
      connect().then((connection) =>
        connection.query(updateSceneImage(sceneId, image.id)).then(() => {
          log.debug({ sceneId, image }, 'Saved scene image to DB');
          return image;
        })
      )
    );
  };
}

function saveImageToDatabase(log, connect) {
  const insertImage = (image) => ({
    name: 'insertImage',
    text: `
      INSERT INTO image (url, thumbnail_url)
      VALUES ($1, $2)
      RETURNING id, url, thumbnail_url
    `,
    values: [image.url, image.thumbnailUrl],
  });

  const updateImage = (image) => ({
    name: 'updateImage',
    text: `
      UPDATE image
      SET url           = $2,
          thumbnail_url = $3
      WHERE image.id = $1
      RETURNING id, url, thumbnail_url
    `,
    values: [image.id, image.url, image.thumbnailUrl],
  });

  const upsert = (image) =>
    image.id ? updateImage(image) : insertImage(image);

  return (image) => {
    log.info({ image }, 'Saving image to DB');

    return connect().then((connection) =>
      connection
        .query(upsert(image))
        .then(({ rows }) => toImage(rows[0]))
        .then(tap((image) => log.debug({ image }, 'Saved image to DB')))
    );
  };
}

function toImage(row) {
  return {
    id: row['id'],
    url: row['url'],
    thumbnailUrl: row['thumbnail_url'],
  };
}

module.exports = {
  saveImageToDatabase,
  saveSceneImageToDatabase,
};
