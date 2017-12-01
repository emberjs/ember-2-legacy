import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:underscore-actions', 'Unit | Controller | Underscore Actions', {
  unit: true
});

test('can access `actions` hash via `_actions`', function(assert) {
  assert.expectDeprecation(() => {
    const instance = this.subject();
    instance.send('foobar');

    assert.equal(instance.get('bazbar'), 'helloworld');
  }, 'Specifying actions in `_actions` is deprecated, please use `actions` instead.');
});
