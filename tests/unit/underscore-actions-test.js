import Route from '@ember/routing/route';
import Controller from '@ember/controller';
import Component from '@ember/component';
import { module, test } from 'qunit';

module('Underscore _actions');

test('that _actions are correctly added to Routes, Controllers, and Components', function(assert) {
  assert.ok(Route.prototype.hasOwnProperty('_actions'), '_actions is defined on Ember.Route');
  assert.ok(Controller.prototype.hasOwnProperty('_actions'), '_actions is defined on Ember.Controller');
  assert.ok(Component.prototype.hasOwnProperty('_actions'), '_actions is defined on Ember.Component');
});
