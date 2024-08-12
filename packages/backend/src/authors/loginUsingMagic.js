const S = require('sanctuary');
const MagicStrategy = require('passport-magic').Strategy;

function configurePassportToUseMagicBasedLogin(
  log,
  getUser,
  magic,
  passport,
  signup,
  login
) {
  passport.serializeUser(serializeUserInPassportSession);

  passport.deserializeUser(deserializeUserFromPassportSession(log, getUser));

  const strategy = new MagicStrategy(async (magicUser, done) => {
    const metadata = await magic.users.getMetadataByIssuer(magicUser.issuer);

    const maybeUser = await getUser(metadata.email);
    if (S.isJust(maybeUser)) {
      const existingUser = S.maybeToNullable(maybeUser);
      return login(existingUser, done);
    } else {
      return signup({}, metadata, done);
    }
  });

  return passport.use(strategy);
}

function signupNewUser(log, saveUser) {
  return async (user, metadata, done) => {
    const newUser = { name: 'You', ...metadata, ...user };

    log.info({ user: newUser }, 'Signing up new user');

    await saveUser(newUser);

    return done(null, newUser);
  };
}

function loginExistingUser(log) {
  return async (user, done) => {
    log.info({ user }, 'Logging in existing user');

    // TODO Replay attack protection (https://go.magic.link/replay-attack)

    return done(null, user);
  };
}

function serializeUserInPassportSession(user, done) {
  done(null, user.email);
}

function deserializeUserFromPassportSession(log, getUser) {
  return async (id, done) => {
    try {
      const maybeUser = await getUser({ email: id });
      if (S.isJust(maybeUser)) {
        log.debug({ id }, 'Existing user found');
        const existingUser = S.maybeToNullable(maybeUser);
        done(null, existingUser);
      } else {
        log.debug({ id }, 'No existing user found');
        done(null, null);
      }
    } catch (err) {
      log.warn({ id, err }, 'Error deserializing user');
      done(err, null);
    }
  };
}

module.exports = {
  signupNewUser,
  loginExistingUser,
  configurePassportToUseMagicBasedLogin,
};
