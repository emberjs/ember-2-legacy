(function() {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_PROPERTY_REQUIRED_SUPPORT !== true) {
    return false;
  }

  if (_Ember.hasOwnProperty('required')) {
    return false;
  }

  Object.defineProperty(_Ember, 'required', {
    get() {
      _Ember.deprecate(
        'Ember.required is deprecated as its behavior is inconsistent and unreliable.',
        false,
        { id: 'ember-metal.required', until: '3.0.0' }
      );

      // Returns an empty function because Ember.required was already unreliable and useless
      // in practice.
      return function() {};
    }
  });
})();
