const { tap } = require('ramda');
const Express = require('express');
const { map, either } = require('sanctuary');
const HttpStatus = require('http-status-codes');

const { validateRequest } = require('../validation');
const {
  getPathParameter,
  getQueryParameter,
  withAsyncErrorHandling,
} = require('../../express');

const {
  validateStoryId,
  validateSceneId,
  validatePassageId,
} = require('../validation/story');

const { toModel } = require('./model');

const getStoryId = getPathParameter('storyId');
const getSceneId = getQueryParameter('sceneId');
const getPassageId = getQueryParameter('passage');

function viewStoryRoute(log, getStory) {
  return Express.Router().get(
    '/stories/:storyId',
    validateRequest(
      validateStoryId(getStoryId),
      validateSceneId(true)(getSceneId),
      validatePassageId(true)(getPassageId)
    ),
    withAsyncErrorHandling((req, res) => {
      const storyId = Number.parseInt(getStoryId(req), 10);
      const sceneId = (() => {
        const sid = getSceneId(req);
        return sid ? Number.parseInt(sid, 10) : undefined;
      })();
      const passageId = getPassageId(req) || undefined;

      const notFoundOnLogicalFailure = (err) => {
        log.warn({ err }, "Can't view story");
        res.status(HttpStatus.NOT_FOUND).json();
      };

      const renderStory = (story) => {
        log.info({ story, sceneId }, 'Rendering story');
        res
          .status(HttpStatus.OK)
          .render('story', { story, title: story.title });
      };

      return getStory({ storyId, sceneId })
        .then(
          map(tap((story) => log.info({ story, sceneId }, 'Viewing story')))
        )
        .then(map(toModel(sceneId, passageId)))
        .then(either(notFoundOnLogicalFailure)(renderStory))
        .catch((err) => {
          log.error({ err }, "Can't view story");
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json();
        });
    })
  );
}

module.exports = { viewStoryRoute };
