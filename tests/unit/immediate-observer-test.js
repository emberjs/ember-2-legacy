import Ember from 'ember';
import { get, set, computed } from '@ember/object';
import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
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

test('immediate observers should fire synchronously', function(assert) {
  let observerCalled = 0;

  // explicitly create a run loop so we do not inadvertently
  // trigger deferred behavior
  run(function() {
    let obj;
    assert.expectDeprecation(() => {
      obj = EmberObject.extend({
        fooDidChange: Ember.immediateObserver('foo', function() {
          observerCalled++;
          assert.equal(get(this, 'foo'), 'barbaz', 'newly set value is immediately available');
        }),

        foo: computed({
          get: function() { return 'yes hello this is foo'; },
          set: function(key, value) { return value; }
        })
      }).create();
    }, /Usage of `Ember.immediateObserver` is deprecated/);

    assert.equal(get(obj, 'foo'), 'yes hello this is foo', 'precond - computed property returns a value');
    assert.equal(observerCalled, 0, 'observer has not yet been called');

    set(obj, 'foo', 'barbaz');

    assert.equal(observerCalled, 1, 'observer was called once');
  });
});

test('that Ember.immediateObserver generally works', function(assert) {
  assert.expect(1);

  const Thing = EmberObject.extend({
    bar: null,
    foo: Ember.immediateObserver('bar', function() {
      assert.ok(true, 'was called!');
    })
  });

  const instance = Thing.create();
  instance.set('bar', 'start');
});

test('Function.prototype.observesImmediately generally works', function(assert) {
  assert.expect(1);

  const Thing = EmberObject.extend({
    bar: null,
    foo: function() {
      assert.ok(true, 'was called!');
    }.observesImmediately('bar'),
  });

  const instance = Thing.create();
  instance.set('bar', 'start');
});
