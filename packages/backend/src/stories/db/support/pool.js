function getConnectionFromPool(log, pool) {
  return () => {
    log.debug('Getting pooled connection');
    return pool.connect();
  };
}

module.exports = {
  getConnectionFromPool,
};
