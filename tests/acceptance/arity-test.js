import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Initializer Initialize is deprecated for 2 arguments');

test('that a deprecation is thrown when 2 arguments are present in the initializers initalize method', function(assert) {
  assert.expectDeprecation('The `initialize` method for Application initializer \'arity\' should take only one argument - `App`, an instance of an `Application`');

  visit('/');
});
