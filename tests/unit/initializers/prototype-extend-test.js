import Ember from 'ember';
import Application from '@ember/application';
import { run } from '@ember/runloop';

import { initialize } from 'dummy/initializers/prototype-extend';
import { module, test } from 'qunit';
import config from 'ember-get-config';
import destroyApp from '../../helpers/destroy-app';

const { EmberENV } = config;

module('Unit | Initializer | Prototype Extend', {
  beforeEach() {
    run(() => {
      this.previousENVFunction = EmberENV.EXTEND_PROTOTYPES.Function;

      this.application = Application.create();
      this.application.deferReadiness();
    });
  },
  afterEach() {
    EmberENV.EXTEND_PROTOTYPES.Function =  this.previousENVFunction;
    delete Function.prototype.observesImmediately;

    destroyApp(this.application);
  }
});

test('that function prototype correctly gets polyfilled', function(assert) {
  EmberENV.EXTEND_PROTOTYPES.Function = true;

  initialize(this.application);

  assert.deepEqual(Function.prototype.observesImmediately, Ember.immediateObserver);
});

test('that function prototype remains unchanged', function(assert) {
  initialize(this.application);

  assert.equal(typeof Function.prototype.observesImmediately, 'undefined');
});
