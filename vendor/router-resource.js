(function() {
  let _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_ROUTER_RESOURCE !== true) {
    return false;
  }

  _Ember.RouterDSL.prototype.resource = function(name, options, callback) {
    if (arguments.length === 2 && typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (typeof options === 'undefined') {
      options = {};
    }

    options.resetNamespace = true;
    _Ember.deprecate('this.resource() is deprecated. Use this.route(\'name\', { resetNamespace: true }, function () {}) instead.', false, { id: 'ember-routing.router-resource', until: '3.0.0' });
    this.route(name, options, callback);
  }
})();
