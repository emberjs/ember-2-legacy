import Ember from 'ember';
import { module, test } from 'qunit';

let originalObserver;

module('Ember.immediateObserver', {
  beforeEach() {
    originalObserver = Ember.observer;
  },

  afterEach() {
    Ember.observer = originalObserver;
  }
});

test('that Ember.immediateObserver is deprecated', function(assert) {
  assert.expectDeprecation(() => {
    const Thing = Ember.Object.extend({
      bar: null,
      baz: null,

      foo: Ember.immediateObserver('bar', function() {
        return this.set('baz', 'helloworld');
      })
    });

    const instance = Thing.create();
    instance.set('bar', 'start');

    assert.equal(instance.get('baz'), 'helloworld');
  }, 'Usage of `Ember.immediateObserver` is deprecated, use `observer` instead');
});

test('that Ember.immediateObserver calls Ember.observer', function(assert) {
    assert.expect(1);

    Ember.observer = () => {
      assert.ok(true);
    };

    const Thing = Ember.Object.extend({
      bar: null,
      baz: null,

      foo: Ember.immediateObserver('bar', function() {
        return this.set('baz', 'helloworld');
      })
    });

    const instance = Thing.create();
    instance.set('bar', 'start');
});
