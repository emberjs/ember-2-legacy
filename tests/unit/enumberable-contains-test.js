import Ember from 'ember';
import { module, test } from 'qunit';

module('Enumberable Contains');

test('that Ember.Enumerable#contains is correctly polyfilled', assert => {
  let Klass = Ember.Object.extend(Ember.Enumerable);
  let obj = Klass.create();
  assert.equal(typeof obj.contains, 'function', 'function is defined on subclasses of Enumerable');
});

test('that Enumerable#contains properly returns this when invoked', assert => {
  let source = [1, 2, 3, 4, 5, 6];
  let Thing = Ember.Object.extend(Ember.Enumerable, {
    nextObject(index) {
      return source[index];
    },
    length: source.length
  });

  let instance = Thing.create();
  assert.ok(instance.contains(4), 'Ember.Enumerable#contains returns true if the item is present');
  assert.notOk(instance.contains(7), 'Ember.Enumerable#contains returns true if the item is not present');
});

test('Ember.Enumerable#contains is applied to Ember arrays', assert => {
  let instance = Ember.A([1, 2, 3, 4, 5, 6]);
  assert.ok(instance.contains(4), 'Ember.Enumerable#contains returns true if the item is present');
  assert.notOk(instance.contains(7), 'Ember.Enumerable#contains returns true if the item is not present');
});
