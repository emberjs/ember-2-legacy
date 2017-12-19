import { test } from 'qunit';
import Component from '@ember/component';
import Controller from '@ember/controller';
import hbs from 'htmlbars-inline-precompile';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Default Layout Behavior');

test('Assigning defaultLayout to a component should set it up as a layout if no layout was found [DEPRECATED]', function(assert) {
  assert.expect(2);

  this.application.register('template:defaultlayout',
    hbs`<div id='wrapper'>{{#my-component}}{{text}}{{/my-component}}</div>`
  );
  this.application.register('controller:defaultlayout', Controller.extend({
    text: 'outer'
  }));
  this.application.register('component:my-component', Component.extend({
    text: 'inner',
    defaultLayout: hbs`{{text}}-{{yield}}`
  }));

  visit('/defaultlayout');

  andThen(function() {
    assert.expectDeprecation();

    let text = find('#wrapper').text().trim();
    assert.equal(text, 'inner-outer', 'The component is composed correctly');
  });
});

test('Assigning defaultLayout to a component should set it up as a layout if layout was found [DEPRECATED]', function(assert) {
  assert.expect(2);

  this.application.register('template:defaultlayout',
    hbs`<div id='wrapper'>{{#my-component}}{{text}}{{/my-component}}</div>`
  );
  this.application.register('template:components/my-component', hbs`{{text}}-{{yield}}`);
  this.application.register('controller:defaultlayout', Controller.extend({
    text: 'outer'
  }));
  this.application.register('component:my-component', Component.extend({
    text: 'inner',
    defaultLayout: hbs`should not see this!`
  }));

  visit('/defaultlayout');

  andThen(function() {
    assert.expectDeprecation(/Specifying `defaultLayout` to .+ is deprecated\./);

    let text = find('#wrapper').text().trim();
    assert.equal(text, 'inner-outer', 'The component is composed correctly');
  });
});
