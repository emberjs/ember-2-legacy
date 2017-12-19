import Component from '@ember/component';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('Integration | Components | Default Layout', {
  integration: true
});

test('can specify template with `defaultLayout` property [DEPRECATED]', function(assert) {
  assert.expectDeprecation(() => {
    let FooBarComponent = Component.extend({
      elementId: 'blahzorz',
      defaultLayout: hbs`much wat {{lulz}}`,
      init() {
        this._super(...arguments);
        this.lulz = 'hey';
      }
    });

    this.register('component:foo-bar', FooBarComponent);
    this.render(hbs`{{foo-bar}}`);

    assert.equal(this.$().text().trim(), 'much wat hey');
  }, /Specifying `defaultLayout` to .* is deprecated. Please use `layout` instead/);
});

test('layout takes precedence over defaultLayout', function(assert) {
  let FooBarComponent = Component.extend({
    elementId: 'blahzorz',
    layout: hbs`so much layout wat {{lulz}}`,
    defaultLayout: hbs`much wat {{lulz}}`,
    init() {
      this._super(...arguments);
      this.lulz = 'hey';
    }
  });

  this.register('component:foo-bar', FooBarComponent);
  this.render(hbs`{{foo-bar}}`);

  assert.equal(this.$().text().trim(), 'so much layout wat hey');
});
