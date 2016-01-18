window.b642array = function (input) {
  /* jshint ignore:start */
  var dec = atob(input),
    i, j, len;
  var ar = new Uint32Array(dec.length / 4);

  for (i = 0, len = dec.length / 4; i < len; i++) {
    ar[i] = 0;
    for (j = 4 - 1; j >= 0; --j) {
      ar[i] += dec.charCodeAt((i * 4) + j) << (j << 3);
    }
  }
  return ar;
  /* jshint ignore:end */
};

window.consoleEvents = function takeOverConsole(cb) {
  if (typeof cb != 'function')
    cb = function () {};
  var original = window.console;
  window.console = {
    log: function () {
      cb('log', arguments);
      original.log.apply(original, arguments);
    },
    warn: function () {
      cb('warn', arguments);
      original.warn.apply(original, arguments);
    },
    error: function () {
      cb('error', arguments);
      original.error.apply(original, arguments);
    }
  };
};
