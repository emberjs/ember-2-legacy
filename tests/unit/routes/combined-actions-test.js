import { moduleFor, test } from 'ember-qunit';

moduleFor('route:combined-actions', 'Unit | Routes | Combined Actions', {
  unit: true
});

test('actions in both `_actions` and `actions` results in an assertion', function(assert) {
  assert.expectAssertion(
    () => this.subject(),
    'Specifying `_actions` and `actions` in the same mixin is not supported.'
  );
});
