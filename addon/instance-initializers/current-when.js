import Ember from 'ember';
import config from 'ember-get-config';

const { EmberENV } = config;

export function initialize(appInstance) {
  if (EmberENV._ENABLE_CURRENT_WHEN_SUPPORT !== true) {
    return false;
  }

  const linkToFactory = appInstance.factoryFor('component:link-to');

  linkToFactory.class.reopen({
    currentWhen: Ember.computed.deprecatingAlias('current-when', { id: 'ember-routing-view.deprecated-current-when', until: '3.0.0' })
  });
}

export default {
  initialize
};
