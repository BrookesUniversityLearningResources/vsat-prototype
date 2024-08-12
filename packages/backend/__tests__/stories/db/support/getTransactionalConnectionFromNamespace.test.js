const ContinuationLocalStorage = require('continuation-local-storage');

const { log } = require('../../../__mocks__/log.js');

jest.mock('../../../__mocks__/log.js');

const {
  getTransactionalConnectionFromNamespace,
} = require('../../../../src/stories/db/support/tx');

test('returns the stored connection', async () => {
  const namespace = ContinuationLocalStorage.createNamespace('vsp@tx');

  try {
    await namespace.run(() => {
      const key = 'connection';
      namespace.set(key, 42);
      const getConnection = getTransactionalConnectionFromNamespace(
        log,
        namespace,
        key
      );

      const connection = getConnection();

      return expect(connection).resolves.toBe(42);
    });
  } finally {
    ContinuationLocalStorage.destroyNamespace(namespace.name);
  }
});

test('errors when there is no stored connection to get', async () => {
  const namespace = ContinuationLocalStorage.createNamespace('vsp@tx');

  try {
    await namespace.run(() => {
      const key = 'connection';
      namespace.set(key, null);
      const getConnection = getTransactionalConnectionFromNamespace(
        log,
        namespace,
        key
      );

      return expect(getConnection()).rejects.toThrow(/No connection found/);
    });
  } finally {
    ContinuationLocalStorage.destroyNamespace(namespace.name);
  }
});
