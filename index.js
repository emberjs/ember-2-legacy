/* eslint-env node */
'use strict'

const debug = require('debug')('ember-2-legacy');
const version = require('./package.json').version;
const mergeTrees = require('broccoli-merge-trees');
const writeFile = require('broccoli-file-creator');
const VersionChecker = require('ember-cli-version-checker');

const minEmberVersion = '3.0.0-beta.3';
const flagToEnvironment = {
  'ember-k': '_ENABLE_EMBER_K_SUPPORT',
  'ember-required': '_ENABLE_PROPERTY_REQUIRED_SUPPORT',
  'safe-string': '_ENABLE_SAFE_STRING_SUPPORT',
  'enumerable-contains': '_ENABLE_ENUMERABLE_CONTAINS_SUPPORT',
  'underscore-actions': '_ENABLE_UNDERSCORE_ACTIONS_SUPPORT',
  'reversed-observer': '_ENABLE_REVERSED_OBSERVER_SUPPORT',
  'initializer-arity': '_ENABLE_INITIALIZER_ARGUMENTS_SUPPORT',
  'router-resource': '_ENABLE_ROUTER_RESOURCE',
  'current-when': '_ENABLE_CURRENT_WHEN_SUPPORT',
  'controller-wrapped': '_ENABLE_CONTROLLER_WRAPPED_SUPPORT',
  'application-registry': '_ENABLE_DEPRECATED_REGISTRY_SUPPORT',
  'immediate-observer': '_ENABLE_IMMEDIATE_OBSERVER_SUPPORT',
  'string-fmt': '_ENABLE_STRING_FMT_SUPPORT',
  'ember-freezable': '_ENABLE_FREEZABLE_SUPPORT',
  'component-defaultlayout': '_ENABLE_COMPONENT_DEFAULTLAYOUT_SUPPORT',
  'ember-binding': '_ENABLE_BINDING_SUPPORT',
  'input-transform': '_ENABLE_INPUT_TRANSFORM_SUPPORT',
  'deprecation-options': '_ENABLE_DEPRECATION_OPTIONS_SUPPORT',
  'orphaned-outlets': '_ENABLE_ORPHANED_OUTLETS_SUPPORT',
  'warn-options': '_ENABLE_WARN_OPTIONS_SUPPORT',
  'resolver-function': '_ENABLE_RESOLVER_FUNCTION_SUPPORT',
  'init-attrs': '_ENABLE_DID_INIT_ATTRS_SUPPORT',
  'render-support': '_ENABLE_RENDER_SUPPORT',
  'property-required': '_ENABLE_PROPERTY_REQUIRED_SUPPORT'
};

module.exports = {
  name: 'ember-2-legacy',

  init() {
    this._super && this._super.init.apply(this, arguments);

    let checker = new VersionChecker(this.parent);
    this.emberVersion = checker.forEmber();
  },

  included() {
    this._super.included.apply(this, arguments);

    const env = this.app.env;

    // This configures EmberENV in a "hacky" way as the 'config' hook is called
    // before the options from EmberApp are provided. There currently is no way of handling
    // this case other than manually messing with configCache or modifing the dom by setting
    // up window.EmberENV before ember loads.
    Object.keys(flagToEnvironment).forEach(flag => {
      this.project.config(env).EmberENV[flagToEnvironment[flag]] = this.flagValue(flag);
    });

    // Always register the version
    this.import('vendor/ember-2-legacy/register-version.js');

    // do nothing if running with Ember 2.x
    if (this.emberVersion.lt(minEmberVersion)) {
      debug(`Not including polyfills as we are running on ${this.emberVersion.version} and require a min of ${minEmberVersion}`);
      return;
    }

    this.importUnlessFlagged('vendor/ember-k.js', ['ember-k']);
    this.importUnlessFlagged('vendor/ember-required.js', ['ember-required']);
    this.importUnlessFlagged('vendor/safe-string.js', ['safe-string']);
    this.importUnlessFlagged('vendor/enumerable-contains.js', ['enumerable-contains']);
    this.importUnlessFlagged('vendor/underscore-actions.js', ['underscore-actions']);
    this.importUnlessFlagged('vendor/reversed-observer.js', ['reversed-observer']);
    this.importUnlessFlagged('vendor/initializer-arity.js', ['initializer-arity']);
    this.importUnlessFlagged('vendor/router-resource.js', ['router-resource']);
    this.importUnlessFlagged('vendor/link-to.js', ['current-when', 'controller-wrapped']);
    this.importUnlessFlagged('vendor/deprecated-registry.js', ['application-registry']);
    this.importUnlessFlagged('vendor/immediate-observer.js', ['immediate-observer']);
    this.importUnlessFlagged('vendor/string-fmt.js', ['string-fmt']);
    this.importUnlessFlagged('vendor/freezable.js', ['ember-freezable']);
    this.importUnlessFlagged('vendor/component-defaultlayout.js', ['component-defaultlayout']);
    this.importUnlessFlagged('vendor/binding.js', ['ember-binding']);
    this.importUnlessFlagged('vendor/text-support.js', ['input-transform']);

    if (this.flagValue('input-transform') !== false) {
      const transform = require('./transforms/input');
      this.app.registry.add('htmlbars-ast-plugin', {
        name: 'transform-input-on-to-onEvent',
        plugin: transform
      });

      debug('including the input transform');
    }
  },

  treeForVendor(rawVendorTree) {
    let babelAddon = this.addons.find(addon => addon.name === 'ember-cli-babel');

    let transpiledVendorTree = babelAddon.transpileTree(rawVendorTree, {
      'ember-cli-babel': {
        compileModules: false,
      },
    });

    let content = `Ember.libraries.register('Ember 2 Legacy', '${version}');`;
    let registerVersionTree = writeFile(
      'ember-2-legacy/register-version.js',
      content
    );

    return mergeTrees([registerVersionTree, transpiledVendorTree]);
  },

  flagValue(flag) {
    let options = this.app.options[this.name] || {};
    return options[flag] === false ? false : true;
  },

  importUnlessFlagged(path, flags) {
    let shouldImport = flags.every(flag => this.flagValue(flag) !== false);

    if (shouldImport) {
      this.import(path);
      debug(`including ${path}`);
    }
  }
};
