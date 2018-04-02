import Ember from 'ember';
import Object, { get } from '@ember/object';
import { module, test } from 'qunit';

module('Ember.required');

test('that Ember.required is correctly polyfilled', function(assert) {
  assert.equal(typeof Ember.required, 'function', 'function is defined on Ember');
});

test('that Ember.required properly returns this when invoked', function(assert) {
  let Thing = Object.extend({ randomProp: Ember.required(), });

  let instance = Thing.create();
  assert.strictEqual(get(instance, 'randomProp'), instance, "Ember.required returns this");
});

test('that Ember.required is deprecated', function(assert) {
  assert.expectDeprecation(() => {
    let obj = { noop: Ember.required() };

    assert.equal(undefined, get(obj, "noop"));
  }, "Ember.required is deprecated as its behavior is inconsistent and unreliable.");
});
