/**
 * Created by Administrator on 2018/1/30 0030.
 */
var pagex = require('./pagex');
var pubsub = require('../pubsubi');
(function (global) {
  var hash = global.location.hash;

  function poll () {
    if (hash !== global.location.hash) {
      hash = global.location.hash;

      // global.dispatchEvent(new Event('hashchanged'));
      pubsub.trigger('hashchanged');
    }

    setTimeout(poll, 500);
  }

  // Make sure a check for 'onhashchange' in window will pass (note: setting to undefined IE<9 causes 'Not implemented' error)
  global.onhashchange = function() {};

  poll();
}(window));
