function getScenesForStoryFromDatabase(log, connect) {
  const forScenesInStory = (storyId) => ({
    name: 'forScenesInStory',
    text: `
      SELECT
        scene.id as scene_id,
        scene.story_id as story_id,
        scene.is_opening_scene as is_opening_scene,
        scene.title as scene_title,
        scene.content as scene_content,
        image.id as image_id,
        image.url as image_url,
        image.thumbnail_url as image_thumbnail_url,
        audio.id as audio_id,
        audio.url as audio_url
      FROM scene
        LEFT JOIN image ON scene.image_id = image.id
        LEFT JOIN audio ON scene.audio_id = audio.id
      WHERE scene.story_id = $1
      ORDER BY scene.is_opening_scene DESC, scene.id;
    `,
    values: [storyId],
  });

  return (storyId) => {
    log.debug({ storyId }, 'Getting scenes from DB');

    return connect()
      .then((connection) => connection.query(forScenesInStory(storyId)))
      .then(({ rows }) => rows.map(toScene));
  };
}

function toScene(row) {
  return {
    id: row['scene_id'],
    title: row['scene_title'],
    storyId: row['story_id'],
    content: row['scene_content'],
    isOpeningScene: row['is_opening_scene'],
    image: toImage(row),
    audio: toAudio(row),
  };
}

function toImage(row) {
  const { image_id: id } = row;
  if (id) {
    return {
      id,
      url: row['image_url'],
      thumbnailUrl: row['image_thumbnail_url'],
    };
  }
  return null;
}

function toAudio(row) {
  const { audio_id: id } = row;
  if (id) {
    return {
      id,
      url: row['audio_url'],
    };
  }
  return null;
}

module.exports = {
  getScenesForStoryFromDatabase,
};
