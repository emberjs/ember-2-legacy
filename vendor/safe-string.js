(function() {
  let _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_SAFE_STRING_SUPPORT !== true) {
    return false;
  }

  if (_Ember.Handlebars.hasOwnProperty('SafeString') === true) {
    return false;
  }

  function getSafeString() {
    _Ember.deprecate(
      'Ember.Handlebars.SafeString is deprecated in favor of Ember.String.htmlSafe',
      false,
      {
        id: 'ember-htmlbars.ember-handlebars-safestring',
        until: '3.0.0',
        url: 'https://emberjs.com/deprecations/v2.x#toc_use-ember-string-htmlsafe-over-ember-handlebars-safestring',
      },
    );

    return _Ember.String.htmlSafe;
  }

  Object.defineProperty(_Ember.Handlebars, 'SafeString', {
    get: getSafeString
  });
})();
