/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    EmberENV: {
      _ENABLE_EMBER_K_SUPPORT: true, // https://www.emberjs.com/deprecations/v2.x/#toc_code-ember-k-code
      _ENABLE_DEPRECATION_OPTIONS_SUPPORT: true, // https://www.emberjs.com/deprecations/v2.x/#toc_id-ember-debug-deprecate-test-as-function
      _ENABLE_ORPHANED_OUTLETS_SUPPORT: true, // https://www.emberjs.com/deprecations/v2.x/#toc_rendering-into-a-render-helper-that-resolves-to-an-outlet
      _ENABLE_WARN_OPTIONS_SUPPORT: true, // https://www.emberjs.com/deprecations/v2.x/#toc_id-ember-debug-deprecate-test-as-function
      _ENABLE_SAFE_STRING_SUPPORT: true, // https://www.emberjs.com/deprecations/v2.x/#toc_use-ember-string-htmlsafe-over-ember-handlebars-safestring
      _ENABLE_ENUMERABLE_CONTAINS_SUPPORT: true, // https://www.emberjs.com/deprecations/v2.x/#toc_enumerable-contains
      _ENABLE_UNDERSCORE_ACTIONS_SUPPORT: true, // N/A
      _ENABLE_RESOLVER_FUNCTION_SUPPORT: true, // https://emberjs.com/deprecations/v2.x/#toc_registry-resolver-as-function
      _ENABLE_DID_INIT_ATTRS_SUPPORT: true, // https://www.emberjs.com/deprecations/v2.x/#toc_ember-component-didinitattrs
      _ENABLE_RENDER_SUPPORT: true, // https://www.emberjs.com/deprecations/v2.x/#toc_rendering-into-a-render-helper-that-resolves-to-an-outlet
      _ENABLE_REVERSED_OBSERVER_SUPPORT: true, // N/A
      _ENABLE_INITIALIZER_ARGUMENTS_SUPPORT: true, // https://www.emberjs.com/deprecations/v2.x/#toc_initializer-arity
      _ENABLE_ROUTER_RESOURCE: true, // N/A
      _ENABLE_CURRENT_WHEN_SUPPORT: true, // N/A
      _ENABLE_DEPRECATED_REGISTRY_SUPPORT: true, // https://emberjs.com/deprecations/v2.x/#toc_ember-application-registry-ember-applicationinstance-registry
      _ENABLE_IMMEDIATE_OBSERVER_SUPPORT: true, // https://www.emberjs.com/deprecations/v1.x/#toc_ember-immediateobserver
      _ENABLE_STRING_FMT_SUPPORT: true, // https://emberjs.com/deprecations/v2.x/#toc_ember-string-fmt
      _ENABLE_FREEZABLE_SUPPORT: true, // https://emberjs.com/deprecations/v1.x/#toc_ember-freezable
      _ENABLE_COMPONENT_DEFAULTLAYOUT_SUPPORT: true, // https://www.emberjs.com/deprecations/v2.x/#toc_ember-component-defaultlayout
      _ENABLE_CONTROLLER_WRAPPED_SUPPORT: true, // https://www.emberjs.com/deprecations/v1.x/#toc_objectcontroller
      _ENABLE_PROPERTY_REQUIRED_SUPPORT: true // N/A
    }
  };
};
