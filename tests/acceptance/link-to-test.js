import { test } from 'qunit';
import Controller from '@ember/controller';
import hbs from 'htmlbars-inline-precompile';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | {{link-to currentWhen="index"}} & {{#link-to "profile" otherController}}');

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

test('unwraps controllers', function(assert) {
  this.application.register('template:link-to', hbs`{{#link-to 'profile' otherController}}Text{{/link-to}}`);
  this.application.register('controller:link-to', Controller.extend({
    otherController: Controller.create({
      model: 'foo'
    })
  }));

  let deprecation = /Providing `{{link-to}}` with a param that is wrapped in a controller is deprecated./;

  visit('/link-to');

  andThen(function() {
    assert.expectDeprecation(deprecation);
    let text = find('a').text().trim();
    assert.equal(text, 'Text', 'The component is composed correctly');
  });
});
