import $ from 'jquery';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import Application from '@ember/application';
import ApplicationInstance from '@ember/application/instance';

module('Deprecated registry');

test('that Ember.Application.registry is correctly polyfilled', function(assert) {
  assert.equal(typeof Application.prototype.registry, 'object', 'registry is present on Ember.Application');
});

test('that Ember.ApplicationInstance.registry is correctly polyfilled', function(assert) {
  assert.equal(typeof ApplicationInstance.prototype.registry, 'object', 'registry is present on Ember.ApplicationInstance');
});

test('properties (and aliases) are correctly assigned for accessing the container and registry', function(assert) {
  assert.expect(6);
  $('#qunit-fixture').html('<div id=\'one\'><div id=\'one-child\'>HI</div></div><div id=\'two\'>HI</div>');
  let application = run(() => Application.create({ rootElement: '#one', router: null }));
  let appInstance = run(() => ApplicationInstance.create({ application }));

  assert.ok(appInstance, 'instance should be created');
  assert.ok(appInstance.__container__, '#__container__ is accessible');
  assert.ok(appInstance.__registry__, '#__registry__ is accessible');

  assert.ok(typeof appInstance.registry.register === 'function', '#registry.register is available as a function');
  appInstance.__registry__.register = function() {
    assert.ok(true, '#register alias is called correctly');
  };

  assert.expectDeprecation(() => {
    appInstance.registry.register();
  }, /Using `ApplicationInstance.registry.register` is deprecated. Please use `ApplicationInstance.register` instead./);
});
