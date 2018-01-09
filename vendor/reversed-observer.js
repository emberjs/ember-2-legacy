(function() {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_REVERSED_OBSERVER_SUPPORT !== true) {
    return false;
  }

  let originalObserver = _Ember.observer;

  _Ember.observer = function(...args) {
    if (typeof args[args.length - 1] !== 'function') {
      _Ember.deprecate(
        'Passing the dependentKeys after the callback function in observer is deprecated. Ensure the callback function is the last argument.',
        false,
        {
          id: 'ember-metal.observer-argument-order',
          until: '3.0.0'
        }
      );

      let [head, ...rest] = args;
      args = [...rest, head];
    }

    return originalObserver(...args);
  }
})();
