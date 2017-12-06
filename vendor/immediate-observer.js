(function() {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_IMMEDIATE_OBSERVER_SUPPORT !== true) {
    return false;
  }

  var originalObserver = _Ember.immediateObserver;

  _Ember.immediateObserver = function() {
    _Ember.deprecate('Usage of `Ember.immediateObserver` is deprecated, use `observer` instead.', false, { id: 'ember-metal.immediate-observer', until: '3.0.0' });

    for (let i = 0; i < arguments.length; i++) {
      let arg = arguments[i];
      _Ember.assert(
        'Immediate observers must observe internal properties only, not properties on other objects.',
        typeof arg !== 'string' || arg.indexOf('.') === -1
      );
    }

    return _Ember.observer.apply(this, arguments);
  }
})();
