(function() {
  let _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_COMPONENT_DEFAULTLAYOUT_SUPPORT !== true) {
    return false;
  }

  _Ember.Component.reopen({
    init() {
      // If a `defaultLayout` was specified move it to the `layout` prop.
      // `layout` is no longer a CP, so this just ensures that the `defaultLayout`
      // logic is supported with a deprecation
      if (this.defaultLayout && !this.layout) {
        _Ember.deprecate(
          `Specifying \`defaultLayout\` to ${this} is deprecated. Please use \`layout\` instead.`,
          false,
          {
            id: 'ember-views.component.defaultLayout',
            until: '3.0.0',
            url: 'https://emberjs.com/deprecations/v2.x/#toc_ember-component-defaultlayout',
          },
        );

        this.layout = this.defaultLayout;
      }

      this._super(...arguments);
    }
  })
})();
