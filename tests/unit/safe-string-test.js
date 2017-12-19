import Ember from 'ember';
import { module, test } from 'qunit';

module('Safe String');

test('that Ember.Handlebars.SafeString is correctly polyfilled', assert => {
  assert.equal(typeof Ember.Handlebars.SafeString, 'function', 'function is defined on Ember');
});

test('that Handlebars.SafeString uses String.htmlSafe under the hood', assert => {
  let someString = '<div>someString</div>';
  let Thing = Ember.Object.extend({
    safeString: Ember.computed(function() {
      return new Ember.Handlebars.SafeString(someString);
    }),

    htmlSafe: Ember.computed(function() {
      return Ember.String.htmlSafe(someString);
    })
  });

  let instance = Thing.create();

  assert.strictEqual(
    instance.get('safeString.string'),
    instance.get('htmlSafe.string'),
    'calling SafeString is the same as htmlSafe'
  );

  assert.ok(Ember.String.isHTMLSafe(instance.get('safeString')));
});

test('that Ember.Handlebars.SafeString is deprecated', assert => {
  new Ember.Handlebars.SafeString();
  assert.expectDeprecation(/Ember.Handlebars.SafeString is deprecated in favor of Ember.String.htmlSafe/);
});
