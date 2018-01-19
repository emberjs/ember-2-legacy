import { assign } from '@ember/polyfills';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

function triggerEvent(element, type, options) {
  let event = document.createEvent('Events');
  event.initEvent(type, true, true);
  assign(event, options);

  run(() => {
    element.dispatchEvent(event);
  });
}

moduleForComponent('Integration | Components | Input Transform', {
  integration: true
});

test('sends an action with `{{input action="foo"}}` when <enter> is pressed [DEPRECATED]', function(assert) {
  assert.expect(1);

  this.set('foo', () => {
    assert.ok(true, 'action was triggered');
  });

  this.render(hbs`{{input classNames='button' action=foo}}`);
  triggerEvent(this.$('input')[0], 'keyup', { keyCode: 13 });
});

