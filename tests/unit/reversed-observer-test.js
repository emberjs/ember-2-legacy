import Object, { observer } from '@ember/object';
import { module, test } from 'qunit';

module('Ember.observer');

test('that Ember.observer is deprecated when function is not the last argument', function(assert) {
  assert.expectDeprecation(() => {
    const Thing = Object.extend({
      bar: null,
      baz: null,

      foo: observer(function() {
        return this.set('baz', 'helloworld');
      }, 'bar')
    });

    const instance = Thing.create();
    instance.set('bar', 'start');

    assert.equal(instance.get('baz'), 'helloworld');
  }, 'Ensure the callback function is the last argument');
});

test('that Ember.observer is not deprecated when function the last argument', function(assert) {
  assert.expectNoDeprecation();
  const Thing = Object.extend({
    bar: null,
    baz: null,

    foo: observer('bar', function() {
      return this.set('baz', 'helloworld');
    })
  });

  const instance = Thing.create();
  instance.set('bar', 'start');

  assert.equal(instance.get('baz'), 'helloworld');
});
