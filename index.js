/* eslint-env node */
'use strict'

const mergeTrees = require('broccoli-merge-trees');
const writeFile = require('broccoli-file-creator');
const version = require('./package.json').version;
const VersionChecker = require('ember-cli-version-checker');

const minEmberVersion = '3.0.0-beta.3';

module.exports = {
  name: 'ember-2-legacy',

  init() {
    this._super && this._super.init.apply(this, arguments);

    let checker = new VersionChecker(this.parent);
    this.emberVersion = checker.forEmber();
  },

  config() {
    // do nothing if running with Ember 2.x
    if (this.emberVersion.lt(minEmberVersion)) {
      return;
    }

    return this._super.config.apply(this, arguments);
  },

  included() {
    this._super.included.apply(this, arguments);

    // Always register the version
    this.import('vendor/ember-2-legacy/register-version.js');

    // do nothing if running with Ember 2.x
    if (this.emberVersion.lt(minEmberVersion)) {
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
    this.import('vendor/binding.js');
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
  }
};
