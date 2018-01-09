/* eslint-env node */
'use strict'

const VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'ember-2-legacy',

  init() {
    this._super && this._super.init.apply(this, arguments);

    let checker = new VersionChecker(this);
    this.emberVersion = checker.forEmber();
  },

  config() {
    // do nothing if running with Ember 2.x
    if (this.emberVersion.lt('3.0.0-alpha.0')) {
      return;
    }

    return this._super.config.apply(this, arguments);
  },

  included() {
    this._super.included.apply(this, arguments);

    // do nothing if running with Ember 2.x
    if (this.emberVersion.lt('3.0.0-alpha.0')) {
      return;
    }

    this.import('vendor/ember-k.js');
    this.import('vendor/safe-string.js');
    this.import('vendor/enumerable-contains.js');
    this.import('vendor/underscore-actions.js');
    this.import('vendor/reversed-observer.js');
    this.import('vendor/initializer-arity.js');
    this.import('vendor/router-resource.js');
    this.import('vendor/link-to.js');
    this.import('vendor/deprecated-registry.js');
    this.import('vendor/immediate-observer.js');
    this.import('vendor/string-fmt.js');
    this.import('vendor/freezable.js');
    this.import('vendor/component-defaultlayout.js');
  },

  treeForVendor(rawVendorTree) {
    let babelAddon = this.addons.find(addon => addon.name === 'ember-cli-babel');

    let transpiledVendorTree = babelAddon.transpileTree(rawVendorTree, {
      'ember-cli-babel': {
        compileModules: false,
      },
    });

    return transpiledVendorTree;
  }
};
