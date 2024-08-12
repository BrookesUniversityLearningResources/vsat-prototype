function validateRequest(...predicates) {
  return (req, res, next) => {
    try {
      predicates.forEach((predicate) => predicate(req));
      next();
    } catch (err) {
      next(err);
    }
  };
}

function isPositiveIntegerString(s) {
  return (
    typeof s === 'string' && /^[0-9]+$/.test(s) && Number.parseInt(s, 10) > 0
  );
}

function isPassageId(s) {
  return typeof s === 'string' && /^[a-z\-]+$/.test(s);
}

module.exports = {
  isPassageId,
  validateRequest,
  isPositiveIntegerString,
};
