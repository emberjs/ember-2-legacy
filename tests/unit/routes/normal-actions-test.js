import { moduleFor, test } from 'ember-qunit';

moduleFor('route:normal-actions', 'Unit | Routes | Normal Actions', {
  unit: true
});

test('can access `actions` hash via `_actions`', function(assert) {
  assert.expect(2);
  const route = this.subject();

  assert.expectDeprecation(function() {
    assert.equal(route._actions.foo(), 'helloworld');
  }, 'Usage of `_actions` is deprecated, use `actions` instead.');
});
