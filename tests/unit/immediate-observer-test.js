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

test('that Ember.immediateObserver is deprecated', assert  => {
  assert.expectDeprecation(() => {
    const Thing = Ember.Object.extend({
      bar: null,
      baz: null,

      foo: Ember.immediateObserver('bar', function() {
        this.set('baz', 'helloworld');
      })
    });

    const instance = Thing.create();
    instance.set('bar', 'start');

    assert.equal(instance.get('baz'), 'helloworld');
  }, 'Usage of `Ember.immediateObserver` is deprecated, use `observer` instead');
});

test('that Ember.immediateObserver calls Ember.observer', assert  => {
    assert.expect(1);

    Ember.observer = () => {
      assert.ok(true, 'immediateObserver calls observer');
    };

    const Thing = Ember.Object.extend({
      bar: null,
      foo: Ember.immediateObserver('bar', function() {})
    });

    const instance = Thing.create();
    instance.set('bar', 'start');
});

test('that function prototype correctly gets polyfilled', assert => {
  assert.deepEqual(Function.prototype.observesImmediately, Ember.immediateObserver);
});
