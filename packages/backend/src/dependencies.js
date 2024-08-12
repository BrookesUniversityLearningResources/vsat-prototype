const Postgres = require('pg');
const Config = require('config');
const Express = require('express');
const Session = require('express-session');
const Passport = require('passport');
const PostgresSession = require('connect-pg-simple');
const { Magic } = require('@magic-sdk/admin');
const ContinuationLocalStorage = require('continuation-local-storage');

const {
  signupNewUser,
  loginExistingUser,
  configurePassportToUseMagicBasedLogin,
} = require('./authors/loginUsingMagic');

const {
  publishStoryRoute,
  unpublishStoryRoute,
} = require('./stories/publishStoryRoute');
const {
  publishStoryToDatabase,
} = require('./stories/db/publishStoryToDatabase');
const {
  getScenesForStoryFromDatabase,
} = require('./stories/db/getScenesForStoryFromDatabase');
const {
  unpublishStoryToDatabase,
} = require('./stories/db/unpublishStoryToDatabase');

const { saveAuthorToDatabase } = require('./stories/db/saveAuthorToDatabase');

const { saveStoryTitleRoute } = require('./stories/saveStoryTitleRoute');
const {
  saveStoryTitleToDatabase,
} = require('./stories/db/saveStoryTitleToDatabase');

const {
  deleteImageFromDatabase,
} = require('./stories/db/deleteImageFromDatabase');

const {
  deleteAudioFromDatabase,
} = require('./stories/db/deleteAudioFromDatabase');
const {
  deleteImage,
  deleteImageRoute,
  deleteAudio,
  deleteAudioRoute,
  deleteSceneRoute,
  deleteScene,
} = require('./stories/deleteSceneRoute');

const {
  deleteSceneFromDatabase,
} = require('./stories/db/deleteSceneFromDatabase');

const {
  deleteStoryFromDatabase,
} = require('./stories/db/deleteStoryFromDatabase');
const { deleteStory, deleteStoryRoute } = require('./stories/deleteStoryRoute');

const { saveSceneToDatabase } = require('./stories/db/saveSceneToDatabase');
const {
  saveSceneImageToDatabase,
} = require('./stories/db/saveSceneImageToDatabase');

const {
  saveSceneAudioToDatabase,
} = require('./stories/db/saveSceneAudioToDatabase');

const {
  saveSceneContentToDatabase,
} = require('./stories/db/saveSceneContentToDatabase');

const {
  saveSceneTitleToDatabase,
} = require('./stories/db/saveSceneTitleToDatabase');

const {
  saveStoryRoute,
  createNewSceneInStoryRoute,
  createNewSceneInStory,
} = require('./stories/saveStoryRoute');

const {
  saveSceneContentRoute,
  saveSceneImageRoute,
  saveSceneAudioRoute,
  saveSceneTitleRoute,
  saveSceneImage,
  uploadImageViaCloudinary,
  deleteImageFromCloudinary,
  deleteAudioFromCloudinary,
  saveSceneAudio,
  uploadAudioViaCloudinary,
} = require('./stories/scenes');

const {
  makeTransactional,
  getTransactionalConnectionFromNamespace,
} = require('./stories/db/support/tx');

const { getConnectionFromPool } = require('./stories/db/support/pool');

const { pingRoute } = require('./pingRoute');

const { loginRoute } = require('./authors/loginRoute');

const {
  createStoryByAuthor,
  createStoryByAuthorRoute,
} = require('./stories/createStoryByAuthorRoute');

const { getStoryForView } = require('./stories/view/getStory');
const { viewStoryRoute } = require('./stories/view/viewStoryRoute');
const { parseSceneContent } = require('./stories/format/parseSceneContent');

const {
  getPublishedStoriesFromDatabase,
} = require('./stories/db/getPublishedStoriesFromDatabase');
const {
  viewPublishedStoriesRoute,
} = require('./stories/view/viewPublishedStoriesRoute');

const {
  getPublishedStoriesRoute,
} = require('./stories/getPublishedStoriesRoute');

const { getStoryRoute } = require('./stories/getStoryRoute');
const { getStoryFromDatabase } = require('./stories/db/getStoryFromDatabase');

const {
  getAuthorFromDatabaseById,
  getAuthorFromDatabaseByEmail,
} = require('./stories/db/getAuthorFromDatabase');

const { saveStoryToDatabase } = require('./stories/db/saveStoryToDatabase');

const {
  getStoriesByAuthorRoute,
} = require('./stories/getStoriesByAuthorRoute');
const {
  getStoriesByAuthorFromDatabase,
} = require('./stories/db/getStoriesByAuthorFromDatabase');

const magic = new Magic(Config.get('magic.secretKey'));

const connectionPool = new Postgres.Pool(Config.get('db'));

function createTransactionalServices(log) {
  const namespace = ContinuationLocalStorage.createNamespace('vsp@tx');

  const tx = makeTransactional(
    log,
    getConnectionFromPool(log, connectionPool),
    namespace
  );

  const getConnection = getTransactionalConnectionFromNamespace(log, namespace);

  return [tx, getConnection];
}

function createMiddleware(log, tx, getConnection) {
  const httpSessionMiddleware = ((pool) => {
    const pgs = PostgresSession(Session);

    const store = new pgs({
      pool,
      conString: process.env.DATABASE_URL,
      tableName: 'session',
    });

    return Session({
      store,
      secret: 'dough verbatim console delicious',
      saveUninitialized: true,
      resave: false,
      unset: 'destroy',
      cookie: { maxAge: 30 /* days */ * 24 * 60 * 60 * 1000 },
    });
  })(connectionPool);

  const userMiddleware = (() => {
    const getUser = tx(getAuthorFromDatabaseByEmail(log, getConnection));

    configurePassportToUseMagicBasedLogin(
      log,
      getUser,
      magic,
      Passport,
      signupNewUser(log, tx(saveAuthorToDatabase(log, getConnection))),
      loginExistingUser(log)
    );

    // noinspection JSCheckFunctionSignatures
    return Passport.initialize();
  })();

  return [httpSessionMiddleware, userMiddleware];
}

function createRoutes(log, tx, getConnection) {
  const getStory = tx(getStoryFromDatabase(log, getConnection));
  const getPublishedStories = tx(
    getPublishedStoriesFromDatabase(log, getConnection)
  );

  const deleteImageFromStorage = deleteImageFromCloudinary(log);
  const deleteAudioFromStorage = deleteAudioFromCloudinary(log);

  // noinspection JSCheckFunctionSignatures on Passport.authenticate
  return [
    pingRoute({ log: Config['log'], port: Config['port'] }),

    viewStoryRoute(log, getStoryForView(getStory, parseSceneContent)),
    viewPublishedStoriesRoute(log, getPublishedStories),

    Express.Router().use('/api', [
      loginRoute(log, Passport.authenticate('magic')),

      getStoryRoute(getStory),
      saveStoryRoute(tx(saveStoryToDatabase(log, getConnection))),
      saveSceneContentRoute(
        tx(saveSceneContentToDatabase(log, getConnection)),
        getStory
      ),
      saveSceneTitleRoute(
        tx(saveSceneTitleToDatabase(log, getConnection)),
        getStory
      ),
      saveStoryTitleRoute(
        tx(saveStoryTitleToDatabase(log, getConnection)),
        getStory
      ),
      saveSceneImageRoute(
        log,
        saveSceneImage(
          uploadImageViaCloudinary(),
          tx(saveSceneImageToDatabase(log, getConnection))
        )
      ),
      saveSceneAudioRoute(
        log,
        saveSceneAudio(
          uploadAudioViaCloudinary(),
          tx(saveSceneAudioToDatabase(log, getConnection))
        )
      ),
      getStoriesByAuthorRoute(
        tx(getStoriesByAuthorFromDatabase(log, getConnection))
      ),
      createStoryByAuthorRoute(
        tx(
          createStoryByAuthor(
            getAuthorFromDatabaseById(log, getConnection),
            saveStoryToDatabase(log, getConnection)
          )
        )
      ),
      createNewSceneInStoryRoute(
        createNewSceneInStory(log, tx(saveSceneToDatabase(log, getConnection))),
        getStory
      ),
      deleteStoryRoute(
        deleteStory(
          log,
          tx(getScenesForStoryFromDatabase(log, getConnection)),
          tx(deleteStoryFromDatabase(log, getConnection)),
          deleteImageFromStorage,
          deleteAudioFromStorage
        )
      ),
      deleteSceneRoute(
        deleteScene(
          tx(deleteSceneFromDatabase(log, getConnection)),
          deleteImageFromStorage,
          deleteAudioFromStorage
        )
      ),
      deleteImageRoute(
        deleteImage(
          log,
          tx(deleteImageFromDatabase(log, getConnection)),
          deleteImageFromStorage
        )
      ),
      deleteAudioRoute(
        deleteAudio(
          log,
          tx(deleteAudioFromDatabase(log, getConnection)),
          deleteAudioFromStorage
        )
      ),
      publishStoryRoute(
        tx(publishStoryToDatabase(log, getConnection)),
        getStory
      ),
      unpublishStoryRoute(
        tx(unpublishStoryToDatabase(log, getConnection)),
        getStory
      ),
      getPublishedStoriesRoute(getPublishedStories),
    ]),
  ];
}

module.exports = {
  createRoutes,
  createMiddleware,
  createTransactionalServices,
};
