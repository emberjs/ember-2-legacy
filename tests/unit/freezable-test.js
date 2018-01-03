import Ember from 'ember';
import Object, { get, set } from '@ember/object';
import { module, test } from 'qunit';

module('Ember.Freezable');

test('frozenCopy should be deprecated', function(assert) {
  assert.expectDeprecation(() => {
    let Obj = Object.extend(Ember.Freezable, Ember.Copyable, {
      copy() {
        return Obj.create();
      }
    });

    Obj.create().frozenCopy();
  }, '`frozenCopy` is deprecated, use `Object.freeze` instead.');
});

test('Ember.Freezable should be deprecated', function(assert) {
  assert.expectDeprecation(() => {
    Object.extend(Ember.Freezable).create();
  }, '`Ember.Freezable` is deprecated, use `Object.freeze` instead.');
});

test('frozen objects should return same instance', function(assert) {
  let obj, copy;

  const CopyableObject = Object.extend(Ember.Freezable, Ember.Copyable, {
    id: null,

    init() {
      this._super(...arguments);
      set(this, 'id', Ember.generateGuid());
    },

    copy() {
      let ret = new CopyableObject();
      set(ret, 'id', get(this, 'id'));
      return ret;
    }
  });

  obj = new CopyableObject();
  assert.ok(!Ember.Freezable || Ember.Freezable.detect(obj), 'object should be freezable');
  copy = obj.frozenCopy();
  assert.equal(get(obj, 'id'), get(copy, 'id'), 'new copy should be equal');
  assert.ok(get(copy, 'isFrozen'), 'returned value should be frozen');

  copy = obj.freeze().frozenCopy();
  assert.deepEqual(copy, obj, 'returns frozen object should be same');
  assert.ok(get(copy, 'isFrozen'), 'returned object should be frozen');
});
