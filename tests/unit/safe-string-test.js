import Ember from 'ember';
import Object, { computed } from '@ember/object';
import { htmlSafe, isHTMLSafe } from '@ember/string';
import { module, test } from 'qunit';

module('Safe String');

test('that Ember.Handlebars.SafeString is correctly polyfilled', function(assert) {
  assert.equal(typeof Ember.Handlebars.SafeString, 'function', 'function is defined on Ember');
});

test('that Handlebars.SafeString uses String.htmlSafe under the hood', function(assert) {
  let someString = '<div>someString</div>';
  let Thing = Object.extend({
    safeString: computed(function() {
      return new Ember.Handlebars.SafeString(someString);
    }),

    htmlSafe: computed(function() {
      return htmlSafe(someString);
    })
  });

  let instance = Thing.create();

  assert.strictEqual(
    instance.get('safeString.string'),
    instance.get('htmlSafe.string'),
    'calling SafeString is the same as htmlSafe'
  );

  assert.ok(isHTMLSafe(instance.get('safeString')));
});

test('that Ember.Handlebars.SafeString is deprecated', function(assert) {
  new Ember.Handlebars.SafeString();
  assert.expectDeprecation(/Ember.Handlebars.SafeString is deprecated in favor of Ember.String.htmlSafe/);
});
