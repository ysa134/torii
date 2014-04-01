// TODO: load based on params
for (var key in requirejs._eak_seen) {
  if (
    requirejs._eak_seen.hasOwnProperty(key) &&
    (/\-test/).test(key)
  ) {
    require(key, null, null, true);
  }
}
