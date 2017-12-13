import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | {{link-to currentWhen="index"}}');

test('that {{link-to}} helper supports currentWhen', function(assert) {
  visit('/about');

  andThen(function() {
    assert.equal(find('#other-link.active').length, 1, 'The link is active since current-when is a parent route');
  });
});

test('that currentWhen will trigger a deprecation', function(assert) {
  visit('/about');

  andThen(function() {
    assert.expectDeprecation('Usage of `currentWhen` is deprecated, use `current-when` instead.');
  });
});
