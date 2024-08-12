const ow = require('ow');
const { pipe } = require('sanctuary');

const { isPositiveIntegerString } = require('./index');

const LABEL_AUTHOR_ID = 'authorId';

const authorIdValidator = ow.create(
  LABEL_AUTHOR_ID,
  ow.string.validate((value) => ({
    validator: isPositiveIntegerString(value),
    message: `Expected \`${LABEL_AUTHOR_ID}\` to be a positive integer, got \`${value}\``,
  }))
);

const validateAuthorId = (getAuthorId) =>
  pipe([getAuthorId, authorIdValidator]);

module.exports = {
  validateAuthorId,
  authorIdValidator,
};
