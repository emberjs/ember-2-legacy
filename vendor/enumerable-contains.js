(function () {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_ENUMERABLE_CONTAINS_SUPPORT !== true) {
    return false;
  }
  if (_Ember.Enumerable.mixins[0].properties.hasOwnProperty('contains')) {
    return false;
  }

  _Ember.Enumerable.reopen({
    contains(obj) {
      _Ember.deprecate(
        '`Enumerable#contains` is deprecated, use `Enumerable#includes` instead.',
        false,
        { id: 'ember-runtime.enumerable-contains', until: '3.0.0', url: 'https://emberjs.com/deprecations/v2.x#toc_enumerable-contains' }
      );

      let found = this.find(item => item === obj);
      return found !== undefined;
    }
  });
})();
