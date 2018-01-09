(function() {
  let _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_EMBER_K_SUPPORT !== true) {
    return false;
  }

  if (_Ember.hasOwnProperty('K')) {
    return false;
  }

  /**
    An empty function useful for some operations. Always returns `this`.

    @method K
    @return {Object}
    @public
    @deprecated
  */
  function deprecatedEmberK() { return this; }

  Object.defineProperty(_Ember, 'K', {
    get() {
      _Ember.deprecate(
        'Ember.K is deprecated in favor of defining a function inline.',
        false,
        {
          id: 'ember-metal.ember-k',
          until: '3.0.0',
          url: 'https://emberjs.com/deprecations/v2.x#toc_code-ember-k-code'
        }
      );

      return deprecatedEmberK;
    }
  });
})();
