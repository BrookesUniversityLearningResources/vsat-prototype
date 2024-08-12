const Express = require('express');
const HttpStatus = require('http-status-codes');
const { isJust, maybeToNullable } = require('sanctuary');

const { getPathParameter, withAsyncErrorHandling } = require('../express');
const { validateAuthorId } = require('./validation/author');
const { validateRequest } = require('./validation');
const { initialOpeningSceneContent } = require('./index');

function createStoryByAuthorRoute(createStoryByAuthor) {
  const getAuthorId = getPathParameter('authorId');

  return Express.Router().post(
    '/author/:authorId/story',
    validateRequest(validateAuthorId(getAuthorId)),
    withAsyncErrorHandling((req, res) => {
      const authorId = Number.parseInt(getAuthorId(req), 10);
      const { title } = req.body;

      return createStoryByAuthor({
        authorId,
        title: title || 'My Story',
      }).then((storyId) =>
        res
          .status(HttpStatus.CREATED)
          .header('Location', `/api/story/${storyId}`)
          .json()
      );
    })
  );
}

function createStoryByAuthor(getAuthor, saveStory) {
  const createStory = (author, title) =>
    saveStory(
      initialStory({
        author: maybeToNullable(author),
        title,
      })
    ).then((story) => story.id);

  return ({ authorId, title }) =>
    getAuthor(authorId).then((author) =>
      isJust(author)
        ? createStory(author, title)
        : Promise.reject(Error(`No author with ID=${authorId}`))
    );
}

function initialStory({ author, title }) {
  return {
    authors: [author],
    title,
    scenes: [initialOpeningSceneContent()],
  };
}

module.exports = {
  createStoryByAuthor,
  createStoryByAuthorRoute,
};
