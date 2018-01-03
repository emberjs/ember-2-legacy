import Object from '@ember/object';
import { A } from '@ember/array';
import Enumerable from '@ember/enumerable';
import { module, test } from 'qunit';

module('Enumberable Contains');

test('that Ember.Enumerable#contains is correctly polyfilled', function(assert) {
  let Klass = Object.extend(Enumerable);
  let obj = Klass.create();
  assert.equal(typeof obj.contains, 'function', 'function is defined on subclasses of Enumerable');
});

test('that Enumerable#contains properly returns this when invoked', function(assert) {
  let source = [1, 2, 3, 4, 5, 6];
  let Thing = Object.extend(Enumerable, {
    nextObject(index) {
      return source[index];
    },
    length: source.length
  });

  let instance = Thing.create();
  assert.ok(instance.contains(4), 'Ember.Enumerable#contains returns true if the item is present');
  assert.notOk(instance.contains(7), 'Ember.Enumerable#contains returns true if the item is not present');
});

test('Ember.Enumerable#contains is applied to Ember arrays', function(assert) {
  let instance = A([1, 2, 3, 4, 5, 6]);
  assert.ok(instance.contains(4), 'Ember.Enumerable#contains returns true if the item is present');
  assert.notOk(instance.contains(7), 'Ember.Enumerable#contains returns true if the item is not present');
});
