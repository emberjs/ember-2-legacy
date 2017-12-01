import Ember from 'ember';
import { module, test } from 'qunit';

module('Deprecated registry');

test('that Ember.Application.registry is correctly polyfilled', assert => {
  assert.equal(typeof Ember.Application.prototype.registry, 'object', 'registry is present on Ember.Application');
});

test('that Ember.ApplicationInstance.registry is correctly polyfilled', assert => {
  assert.equal(typeof Ember.ApplicationInstance.prototype.registry, 'object', 'registry is present on Ember.ApplicationInstance');
});

