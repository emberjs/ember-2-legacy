/*global EmberENV */
import Ember from 'ember';
import { module, test } from 'qunit';

module('Ember.String.fmt');

test('that Ember.String.fmt is correctly polyfilled', function(assert) {
  assert.equal(typeof Ember.String.fmt, 'function', 'function is defined on Ember');
});

test('that Ember.String.fmt formats a string', function(assert) {
  assert.equal(Ember.String.fmt('Hello %@ %@', ['John', 'Doe']), 'Hello John Doe')
  assert.equal(Ember.String.fmt('Hello %@ %@', ['John', 'Madden']), 'Hello John Madden')
});

test('that Ember.String.fmt is deprecated', function(assert) {
  assert.expectDeprecation(() => {
    let result = Ember.String.fmt('%@', 'Hello');

    assert.equal(result, 'Hello');
  }, 'Ember.String.fmt is deprecated, use ES6 template strings instead.');
});

function testMacro(given, args, expected, description) {
  test(description, function(assert) {
    assert.expectDeprecation(() => {
      assert.equal(Ember.String.fmt(given, args), expected);
      if (EmberENV.EXTEND_PROTOTYPES.String) {
        assert.equal(given.fmt(...args), expected);
      }
    }, 'Ember.String.fmt is deprecated, use ES6 template strings instead.');
  });
}

testMacro('Hello %@ %@', ['John', 'Doe'], 'Hello John Doe', `fmt('Hello %@ %@', ['John', 'Doe']) => 'Hello John Doe'`);
testMacro('Hello %@2 %@1', ['John', 'Doe'], 'Hello Doe John', `fmt('Hello %@2 %@1', ['John', 'Doe']) => 'Hello Doe John'`);
testMacro(
  '%@08 %@07 %@06 %@05 %@04 %@03 %@02 %@01',
  ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'],
  'Eight Seven Six Five Four Three Two One',
  `fmt('%@08 %@07 %@06 %@05 %@04 %@03 %@02 %@01', ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight']) => 'Eight Seven Six Five Four Three Two One'`
);
testMacro('data: %@', [{ id: 3 }], 'data: {id: 3}', `fmt('data: %@', [{ id: 3 }]) => 'data: {id: 3}'`);

test('works with argument form', function(assert) {
  assert.expectDeprecation(() => {
    assert.equal(Ember.String.fmt('%@', 'John'), 'John');
    assert.equal(Ember.String.fmt('%@ %@', ['John'], 'Doe'), '[John] Doe');
  }, 'Ember.String.fmt is deprecated, use ES6 template strings instead.');
});
