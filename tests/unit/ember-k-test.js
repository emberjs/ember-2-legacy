import Ember from 'ember';
import { module, test } from 'qunit';

module('Ember.K');

test('that Ember.K is correctly polyfilled', function(assert) {
  assert.equal(typeof Ember.K, 'function', 'function is defined on Ember');
});

test('that Ember.K properly returns this when invoked', function(assert) {
  let Thing = Ember.Object.extend({
    randomMethod: Ember.K,
  });

  let instance = Thing.create();
  assert.strictEqual(instance.randomMethod(), instance, 'Ember.K returns this');
});

test('that Ember.K is deprecated', function(assert) {
  assert.expectDeprecation(() => {
    let obj = {
      noop: Ember.K
    };

    assert.equal(obj, obj.noop());
  }, 'Ember.K is deprecated in favor of defining a function inline.');
});
