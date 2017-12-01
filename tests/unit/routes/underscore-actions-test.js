import { moduleFor, test } from 'ember-qunit';

moduleFor('route:underscore-actions', 'Unit | Routes | Underscore Actions', {
  unit: true
});

test('actions added via `_actions` can be used', function(assert) {
  assert.expectDeprecation(() => {
    const instance = this.subject();
    instance.send('foobar');

    assert.equal(instance.get('bazbar'), 'helloworld');
  }, 'Specifying actions in `_actions` is deprecated, please use `actions` instead.');
});
