/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-2-legacy',

  included() {
    this._super.included.apply(this, arguments);

    this.import('vendor/ember-k.js');
  }
};
