function deleteStoryFromDatabase(log, connect) {
  return (storyId) => {
    log.info({ storyId }, 'Deleting story from DB');

    return connect().then((connection) =>
      connection.query('DELETE FROM story WHERE story.id = $1', [storyId])
    );
  };
}

module.exports = {
  deleteStoryFromDatabase,
};
