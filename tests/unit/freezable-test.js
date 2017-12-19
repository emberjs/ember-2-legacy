import Ember from 'ember';
import { module, test } from 'qunit';

module('Ember.Freezable');

const { get, set } = Ember;

test('frozenCopy should be deprecated', assert => {
  assert.expectDeprecation(() => {
    let Obj = Ember.Object.extend(Ember.Freezable, Ember.Copyable, {
      copy() {
        return Obj.create();
      }
    });

    Obj.create().frozenCopy();
  }, '`frozenCopy` is deprecated, use `Object.freeze` instead.');
});

test('Ember.Freezable should be deprecated', assert => {
  assert.expectDeprecation(() => {
    Ember.Object.extend(Ember.Freezable).create();
  }, '`Ember.Freezable` is deprecated, use `Object.freeze` instead.');
});

test('frozen objects should return same instance', assert => {
  let obj, copy;

  const CopyableObject = Ember.Object.extend(Ember.Freezable, Ember.Copyable, {
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
  assert.equal(Ember.get(obj, 'id'), Ember.get(copy, 'id'), 'new copy should be equal');
  assert.ok(get(copy, 'isFrozen'), 'returned value should be frozen');

  copy = obj.freeze().frozenCopy();
  assert.deepEqual(copy, obj, 'returns frozen object should be same');
  assert.ok(get(copy, 'isFrozen'), 'returned object should be frozen');
});
