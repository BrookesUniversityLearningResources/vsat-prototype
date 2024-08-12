const Helmet = require('helmet');
const { omit } = require('ramda');

/**
 * The app's [Content Security Policy](https://developers.google.com/web/fundamentals/security/csp) (CSP).
 *
 * @return the CSP directives.
 * @see [Helmet](https://helmetjs.github.io/)
 */
function contentSecurityPolicy() {
  return {
    directives: {
      ...omit(
        ['script-src-attr'],
        Helmet.contentSecurityPolicy.getDefaultDirectives()
      ),
      'default-src': ["'self'"],
      'frame-src': ['https://auth.magic.link/'],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'aframe.io',
        'rawgit.com',
        'unpkg.com',
        'cdnjs.cloudflare.com',
        'blob:',
      ],
      'img-src': ["'self'", 'res.cloudinary.com', 'data:'],
      'media-src': ["'self'", 'res.cloudinary.com'],
      'connect-src': [
        'fonts.gstatic.com',
        'ancient-sierra-54813.herokuapp.com',
        'www.virtualstorytellingproject.com',
        'res.cloudinary.com',
        'auth.magic.link'
      ],
      'worker-src': ["'self'", 'blob:'],
      'upgrade-insecure-requests': [],
    },
  };
}

module.exports = {
  contentSecurityPolicy,
};
