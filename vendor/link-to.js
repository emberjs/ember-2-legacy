(function() {
  let _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  const reopenObject = {
    currentWhen: _Ember.computed.deprecatingAlias('current-when', {
      id: 'ember-routing-view.deprecated-current-when',
      until: '3.0.0'
    }),

    _getModels(params) {
      let modelCount = params.length - 1;
      let models = new Array(modelCount);

      for (let i = 0; i < modelCount; i++) {
        let value = params[i + 1];

        while (_Ember.ControllerMixin.detect(value)) {
          _Ember.deprecate(
            'Providing `{{link-to}}` with a param that is wrapped in a controller is deprecated. ' +
            (this.parentView ? 'Please update `' + this.parentView +
              '` to use `{{link-to "post" someController.model}}` instead.' : ''),
            false,
            { id: 'ember-routing-views.controller-wrapped-param', until: '3.0.0' },
          );
          value = value.get('model');
        }

        models[i] = value;
      }

      return models;
    }
  }

  if (EmberENV && EmberENV._ENABLE_CURRENT_WHEN_SUPPORT !== true) {
    delete reopenObject['currentWhen'];
  }

  if (EmberENV && EmberENV._ENABLE_CONTROLLER_WRAPPED_SUPPORT !== true) {
    delete reopenObject['_getModels'];
  }

  _Ember.LinkComponent.reopen(reopenObject);
})();
