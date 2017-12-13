(function() {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_INITIALIZER_ARGUMENTS_SUPPORT !== true) {
    return false;
  }

  _Ember.Engine.reopen({
    /**
      @private
      @method runInitializers
    */
    runInitializers() {
      this._runInitializer('initializers', (name, initializer) => {
        _Ember.assert(`No application initializer named '${name}'`, !!initializer);
        if (initializer.initialize.length === 2) {
          _Ember.deprecate(`The \`initialize\` method for Application initializer '${name}' should take only one argument - \`App\`, an instance of an \`Application\`.`,
          false, {
            id: 'ember-application.app-initializer-initialize-arguments',
            until: '3.0.0',
            url: 'https://emberjs.com/deprecations/v2.x/#toc_initializer-arity'
          });

          initializer.initialize(this.__registry__, this);
        } else {
          initializer.initialize(this);
        }
      });
    }
  })
})();
