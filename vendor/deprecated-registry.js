(function () {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_DEPRECATED_REGISTRY_SUPPORT !== true) {
    return false;
  }

  if (!_Ember.Application.prototype.registry) {
    Object.defineProperty(_Ember.Application.prototype, 'registry', {
      configurable: true,
      enumerable: false,
      get() {
        return buildFakeRegistryWithDeprecations(this, 'Application');
      }
    });
  }

  if (!_Ember.ApplicationInstance.prototype.registry) {
    Object.defineProperty(_Ember.ApplicationInstance.prototype, 'registry', {
      configurable: true,
      enumerable: false,
      get() {
        return buildFakeRegistryWithDeprecations(this, 'ApplicationInstance');
      }
    });
  }

  function buildFakeRegistryWithDeprecations(instance, typeForMessage) {
    let fakeRegistry = {};
    let registryProps = {
      resolve: 'resolveRegistration',
      register: 'register',
      unregister: 'unregister',
      has: 'hasRegistration',
      option: 'registerOption',
      options: 'registerOptions',
      getOptions: 'registeredOptions',
      optionsForType: 'registerOptionsForType',
      getOptionsForType: 'registeredOptionsForType',
      injection: 'inject'
    };

    for (let deprecatedProperty in registryProps) {
      fakeRegistry[deprecatedProperty] = buildFakeRegistryFunction(instance, typeForMessage, deprecatedProperty, registryProps[deprecatedProperty]);
    }

    return fakeRegistry;
  }

  function buildFakeRegistryFunction(instance, typeForMessage, deprecatedProperty, nonDeprecatedProperty) {
    return function() {
      _Ember.deprecate(
        `Using \`${typeForMessage}.registry.${deprecatedProperty}\` is deprecated. Please use \`${typeForMessage}.${nonDeprecatedProperty}\` instead.`,
        false,
        {
          id: 'ember-application.app-instance-registry',
          until: '3.0.0',
          url: 'https://emberjs.com/deprecations/v2.x/#toc_ember-application-registry-ember-applicationinstance-registry'
        }
      );
      return instance[nonDeprecatedProperty](...arguments);
    };
  }
})();
