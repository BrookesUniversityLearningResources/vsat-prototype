const { tap } = require('ramda');
const Express = require('express');
const { map, isJust, maybeToNullable } = require('sanctuary');
const HttpStatus = require('http-status-codes');

const { withAsyncErrorHandling } = require('../../express');

function viewPublishedStoriesRoute(log, getStories) {
  return Express.Router().get(
    '/stories',
    withAsyncErrorHandling((req, res) => {
      const renderStories = (stories) => {
        log.info({ total: stories.length }, 'Rendering published stories');
        res.status(HttpStatus.OK).render('stories', { stories });
      };

      return getStories()
        .then(
          map(
            tap((stories) =>
              log.info(
                { stories },
                'Retrieved %d published stories',
                stories.length
              )
            )
          )
        )
        .then((stories) =>
          renderStories(isJust(stories) ? maybeToNullable(stories) : [])
        );
    })
  );
}

module.exports = { viewPublishedStoriesRoute };
