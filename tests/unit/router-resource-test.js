import { module, test } from 'ember-qunit';
import EmberRouter from '@ember/routing/router';

let Router;

module('Ember.RouterDSL.resource', {
  beforeEach() {
    Router = EmberRouter.extend();
  },

  afterEach() {
    Router = null;
  }
});

test('should reset namespace if nested with resource', assert => {
  assert.expect(4);

  assert.expectDeprecation(() => {
    Router = Router.map(function() {
      this.resource('bleep', function() {
        this.resource('bloop', function() {
          this.resource('blork');
        });
      });
    });

    let router = Router.create();
    router._initRouterJs();

    if (router._routerMicrolib) {
      assert.ok(router._routerMicrolib.recognizer.names['bleep'], 'nested resources do not contain parent name');
      assert.ok(router._routerMicrolib.recognizer.names['bloop'], 'nested resources do not contain parent name');
      assert.ok(router._routerMicrolib.recognizer.names['blork'], 'nested resources do not contain parent name');
    }
    else {
      assert.ok(router.router.recognizer.names['bleep'], 'nested resources do not contain parent name');
      assert.ok(router.router.recognizer.names['bloop'], 'nested resources do not contain parent name');
      assert.ok(router.router.recognizer.names['blork'], 'nested resources do not contain parent name');
    }

   }, 'this.resource() is deprecated. Use this.route(\'name\', { resetNamespace: true }, function () {}) instead.');
});

test('should fail when using a reserved route name', assert => {
  assert.expectDeprecation(() => {
    let reservedNames = ['array', 'basic', 'object', 'application'];

    assert.expect((reservedNames.length * 2) + 1);

    reservedNames.forEach(reservedName => {
      assert.expectAssertion(() => {
        Router = EmberRouter.extend();

        Router.map(function() {
          this.route(reservedName);
        });

        let router = Router.create();
        router._initRouterJs();
      }, '\'' + reservedName + '\' cannot be used as a route name.');

      assert.expectAssertion(() => {
        Router = EmberRouter.extend();

        Router.map(function() {
          this.resource(reservedName);
        });

        let router = Router.create();
        router._initRouterJs();
      }, `'${reservedName}' cannot be used as a route name.`);
    });
  }, 'this.resource() is deprecated. Use this.route(\'name\', { resetNamespace: true }, function () {}) instead.');
});
