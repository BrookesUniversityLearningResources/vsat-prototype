const Path = require('path');

const Express = require('express');
const Helmet = require('helmet');
const Nunjucks = require('nunjucks');

const {
  withAsyncErrorHandling,
  errorHandlerForArgumentError,
  errorHandlerForAnyOtherError,
} = require('./express');

const { contentSecurityPolicy } = require('./csp');

function createExpressApplication(log, routes, middleware = []) {
  const app = Express()
    .disable('x-powered-by')
    .use(
      Helmet({
        hidePoweredBy: false,
        contentSecurityPolicy: contentSecurityPolicy(),
        // need to disable this explicitly else Magic Auth won't work
        // https://stackoverflow.com/questions/71904052/getting-notsameoriginafterdefaultedtosameoriginbycoep-error-with-helmet
        crossOriginEmbedderPolicy: false,
      })
    )
    .use(Helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
    .use(Helmet.crossOriginOpenerPolicy({ policy: "unsafe-none" }))
    .use(Express.json());

  middleware.forEach((ware) => app.use(ware));

  Nunjucks.configure(Path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
    noCache: true,
  });
  app.set('view engine', '.njk');

  routes.map(withAsyncErrorHandling).forEach((route) => app.use(route));

  if (process.env.NODE_ENV === 'production') {
    log.debug('Serving frontend app from backend');

    const frontendPath = Path.join(__dirname, '../../frontend/build');

    app
      .use(Express.static(frontendPath))
      .get('*', (req, res) =>
        res.sendFile(Path.join(frontendPath, 'index.html'))
      );
  }

  return app
    .use(errorHandlerForArgumentError())
    .use(errorHandlerForAnyOtherError());
}

module.exports = {
  createExpressApplication,
};
