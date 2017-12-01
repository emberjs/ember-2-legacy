import Ember from 'ember';
import { module, test } from 'qunit';

module('Underscore _actions');

test('that _actions are correctly added to Routes, Controllers, and Components', assert => {
  assert.ok(Ember.Route.prototype.hasOwnProperty('_actions'), '_actions is defined on Ember.Route');
  assert.ok(Ember.Controller.prototype.hasOwnProperty('_actions'), '_actions is defined on Ember.Controller');
  assert.ok(Ember.Component.prototype.hasOwnProperty('_actions'), '_actions is defined on Ember.Component');
});
