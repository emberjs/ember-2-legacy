(function() {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_UNDERSCORE_ACTIONS_SUPPORT !== true) {
    return false;
  }

  function deprecateUnderscoreActions(factory) {
    Object.defineProperty(factory.prototype, '_actions', {
      configurable: true,
      enumerable: false,
      set(value) {
        _Ember.assert(`You cannot set \`_actions\` on ${this}, please use \`actions\` instead.`);
      },
      get() {
        _Ember.deprecate(
          `Usage of \`_actions\` is deprecated, use \`actions\` instead.`,
          false,
          { id: 'ember-runtime.action-handler-_actions', until: '3.0.0' }
        );
        return _Ember.get(this, 'actions');
      }
    });
  }

  _Ember.ActionHandler.reopen({
    willMergeMixin(props) {
      _Ember.assert('Specifying `_actions` and `actions` in the same mixin is not supported.', !props.actions || !props._actions);

      if (props._actions) {
        _Ember.deprecate(
          'Specifying actions in `_actions` is deprecated, please use `actions` instead.',
          false,
          { id: 'ember-runtime.action-handler-_actions', until: '3.0.0' }
        );

        props.actions = props._actions;
        delete props._actions;
      }
    }
  })

  var classesToExtend = [_Ember.Route, _Ember.Controller, _Ember.Component];

  classesToExtend.filter(function(klass) {
    return !_Ember.get(klass, 'prototype').hasOwnProperty('_actions');
  })
  .forEach(deprecateUnderscoreActions);
})();
