import Ember from 'ember';
import config from 'ember-get-config';

export function initialize() {
  const { EmberENV } = config;

  if (EmberENV.EXTEND_PROTOTYPES && EmberENV.EXTEND_PROTOTYPES.Function === true && Ember.immediateObserver) {
    Function.prototype.observesImmediately = Ember.immediateObserver;
  }
}

export default {
  name: 'prototype-extensions',
  initialize: initialize
};
