(function() {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_CURRENT_WHEN_SUPPORT !== true) {
    return false;
  }

  _Ember.LinkComponent.reopen({
    currentWhen: _Ember.computed.deprecatingAlias('current-when', {
      id: 'ember-routing-view.deprecated-current-when',
      until: '3.0.0'
    })
  });
})();
