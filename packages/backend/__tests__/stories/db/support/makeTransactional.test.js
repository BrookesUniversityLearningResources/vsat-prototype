const ContinuationLocalStorage = require('continuation-local-storage');

const { log } = require('../../../__mocks__/log.js');

jest.mock('../../../__mocks__/log.js');

const { makeTransactional } = require('../../../../src/stories/db/support/tx');

test('sunny day transactional lifecycle is BEGIN ➡️ work ➡️ COMMIT', async () => {
  const namespace = ContinuationLocalStorage.createNamespace('vsp@tx');

  try {
    const query = jest.fn(() => Promise.resolve());
    const releaseConnection = jest.fn(() => Promise.resolve());

    const connect = jest.fn(() =>
      Promise.resolve({
        query,
        release: releaseConnection,
      })
    );

    const work = jest.fn((number) => Promise.resolve(number));

    const txWork = makeTransactional(log, connect, namespace)(work);

    await expect(txWork(42)).resolves.toEqual(42);

    expect(query).toHaveBeenCalledTimes(2);
    expect(query).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(query).toHaveBeenNthCalledWith(2, 'COMMIT');

    // the connection must *always* be released
    expect(releaseConnection).toHaveBeenCalledTimes(1);
  } finally {
    ContinuationLocalStorage.destroyNamespace(namespace.name);
  }
});

test('rainy day transactional lifecycle is BEGIN ➡️ work ➡️ ROLLBACK', async () => {
  const namespace = ContinuationLocalStorage.createNamespace('vsp@tx');

  try {
    const query = jest.fn(() => Promise.resolve());
    const releaseConnection = jest.fn(() => Promise.resolve());

    const connect = jest.fn(() =>
      Promise.resolve({
        query,
        release: releaseConnection,
      })
    );

    const work = jest.fn((number) => Promise.reject(Error('nope')));

    const txWork = makeTransactional(log, connect, namespace)(work);

    await expect(txWork(42)).rejects.toThrow(/nope/);

    expect(query).toHaveBeenCalledTimes(2);
    expect(query).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(query).toHaveBeenNthCalledWith(2, 'ROLLBACK');

    // the connection must *always* be released, even in rainy day scenarios
    expect(releaseConnection).toHaveBeenCalledTimes(1);
  } finally {
    ContinuationLocalStorage.destroyNamespace(namespace.name);
  }
});
