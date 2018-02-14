import { module, test } from 'qunit';
import { A } from '@ember/array';

module('Enumberable Contains');

test('Ember.Array#contains works', function(assert) {
  let instance = A([1, 2, 3, 4, 5, 6]);
  assert.ok(instance.contains(4), 'Ember.Array#contains returns true if the item is present');
  assert.notOk(instance.contains(7), 'Ember.Array#contains returns true if the item is not present');
});
