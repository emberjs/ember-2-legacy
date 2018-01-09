import Route from '@ember/routing/route';
import Controller from '@ember/controller';
import Component from '@ember/component';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Underscore _actions', function(hooks) {
  setupTest(hooks);



  function confirmActionsAreHandled(type, Klass) {
    test(`_actions defined on ${type} at extend time is properly handled`, function(assert) {
      function definedAction() { }
      this.owner.register(`${type}:foo`, Klass.extend({
        // eslint-disable-next-line
        _actions: {
          foo: definedAction,
        }
      }));

      let instance = this.owner.factoryFor(`${type}:foo`).create();

      assert.strictEqual(instance.actions.foo, definedAction);
    });
  }

  confirmActionsAreHandled('route', Route);
  confirmActionsAreHandled('controller', Controller);
  confirmActionsAreHandled('component', Component);
});
