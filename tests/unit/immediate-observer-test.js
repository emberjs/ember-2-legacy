import Ember from 'ember';
import Object from '@ember/object';
import { module, test } from 'qunit';

let originalObserver;

module('Ember.immediateObserver', {
  beforeEach() {
    // eslint-disable-next-line ember/new-module-imports
    originalObserver = Ember.observer;
  },

  afterEach() {
    // eslint-disable-next-line ember/new-module-imports
    Ember.observer = originalObserver;
  }
});

test('that Ember.immediateObserver is deprecated', function(assert) {
  assert.expectDeprecation(() => {
    const Thing = Object.extend({
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

test('that Ember.immediateObserver calls Ember.observer', function(assert) {
    assert.expect(1);

    // eslint-disable-next-line ember/new-module-imports
    Ember.observer = () => {
      assert.ok(true, 'immediateObserver calls observer');
    };

    const Thing = Object.extend({
      bar: null,
      foo: Ember.immediateObserver('bar', function() {})
    });

    const instance = Thing.create();
    instance.set('bar', 'start');
});

test('that function prototype correctly gets polyfilled', function(assert) {
  assert.deepEqual(Function.prototype.observesImmediately, Ember.immediateObserver);
});
