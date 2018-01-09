import Ember from 'ember';
import EmberObject, { observer } from '@ember/object';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { set, get } from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Ember.Binding', function(hooks) {

  hooks.afterEach(function() {
    // prevent test leakage
    run.cancelTimers();
  });

  module('Ember.bind', function(hooks) {
    let fromObject, toObject, binding, root;

    hooks.beforeEach(function(assert) {
      fromObject = EmberObject.create({ value: 'start' });
      toObject = EmberObject.create({ value: 'end' });
      root = { fromObject: fromObject, toObject: toObject };
      run(() => {
        assert.expectDeprecation(() => {
          binding = Ember.bind(root, 'toObject.value', 'fromObject.value');
        }, /`Ember\.Binding` is deprecated./);
      });
    });

    test('binding should have synced on connect', function(assert) {
      assert.equal(get(toObject, 'value'), 'start', 'toObject.value should match fromObject.value');
    });

    test('fromObject change should propagate to toObject only after flush', function(assert) {
      run(() => {
        set(fromObject, 'value', 'change');
        assert.equal(get(toObject, 'value'), 'start');
      });
      assert.equal(get(toObject, 'value'), 'change');
    });

    test('toObject change should propagate to fromObject only after flush', function(assert) {
      run(() => {
        set(toObject, 'value', 'change');
        assert.equal(get(fromObject, 'value'), 'start');
      });
      assert.equal(get(fromObject, 'value'), 'change');
    });

    test('deferred observing during bindings', function(assert) {
      // setup special binding
      fromObject = EmberObject.create({
        value1: 'value1',
        value2: 'value2'
      });

      toObject = EmberObject.extend({
        observer: observer('value1', 'value2', function() {
          assert.equal(get(this, 'value1'), 'CHANGED', 'value1 when observer fires');
          assert.equal(get(this, 'value2'), 'CHANGED', 'value2 when observer fires');
          this.callCount++;
        })
      }).create({
        value1: 'value1',
        value2: 'value2',

        callCount: 0
      });

      let root = { fromObject: fromObject, toObject: toObject };
      run(function () {
        assert.expectDeprecation(() => {
          Ember.bind(root, 'toObject.value1', 'fromObject.value1');
        }, /`Ember\.Binding` is deprecated./);

        assert.expectDeprecation(() => {
          Ember.bind(root, 'toObject.value2', 'fromObject.value2');
        }, /`Ember\.Binding` is deprecated./);

        // change both value1 + value2, then  flush bindings.  observer should only
        // fire after bindings are done flushing.
        set(fromObject, 'value1', 'CHANGED');
        set(fromObject, 'value2', 'CHANGED');
      });

      assert.equal(toObject.callCount, 2, 'should call observer twice');
    });

    test('binding disconnection actually works', function(assert) {
      binding.disconnect(root);
      run(function () {
        set(fromObject, 'value', 'change');
      });
      assert.equal(get(toObject, 'value'), 'start');
    });

    test('chained binding', function(assert) {
      let first, second, third;
      run(function() {
        first = EmberObject.create({ output: 'first' });

        second = EmberObject.extend({
          inputDidChange: observer('input', function() {
            set(this, 'output', get(this, 'input'));
          })
        }).create({
          input: 'second',
          output: 'second'
        });

        third = EmberObject.create({ input: 'third' });

        root = { first: first, second: second, third: third };

        assert.expectDeprecation(() => {
          Ember.bind(root, 'second.input', 'first.output');
        }, /`Ember\.Binding` is deprecated./);

        assert.expectDeprecation(() => {
          Ember.bind(root, 'second.output', 'third.input');
        }, /`Ember\.Binding` is deprecated./);
      });

      run(function() {
        set(first, 'output', 'change');
        assert.equal('change', get(first, 'output'), 'first.output');
        assert.ok('change' !== get(third, 'input'), 'third.input');
      });

      assert.equal('change', get(first, 'output'), 'first.output');
      assert.equal('change', get(second, 'input'), 'second.input');
      assert.equal('change', get(second, 'output'), 'second.output');
      assert.equal('change', get(third, 'input'), 'third.input');
    });
  });

  module('Ember.Object.prototype.bind', function(hooks) {
    let testObject, fromObject, TestObject;

    hooks.beforeEach(function() {
      TestObject = EmberObject.extend({
        foo: 'bar',
        bar: 'foo',
        extraObject: null
      });

      testObject = EmberObject.create({
        foo: 'bar',
        bar: 'foo',
        extraObject: null
      });

      fromObject = EmberObject.create({
        bar: 'foo',
        extraObject: null
      });

      Ember.lookup['TestNamespace'] = {
        fromObject: fromObject,
        testObject: testObject
      };
    });

    test('bind(.bar) should bind to relative path', function(assert) {
      run(() => {
        assert.expectDeprecation(() => {
          // create binding
          testObject.bind('foo', 'bar');
        }, /`Ember.Binding` is deprecated/);

        // now make a change to see if the binding triggers.
        set(testObject, 'bar', 'changedValue');
      });

      assert.equal('changedValue', get(testObject, 'foo'), 'testObject.foo');
    });

    test('bind(TestNamespace.fromObject.bar) should follow absolute path', function(assert) {
      run(() => {
        assert.expectDeprecation(() => {
          // create binding
          testObject.bind('foo', 'TestNamespace.fromObject.bar');
        }, /`Ember.Binding` is deprecated/);

        // now make a change to see if the binding triggers.
        set(fromObject, 'bar', 'changedValue');
      });

      assert.equal('changedValue', get(testObject, 'foo'), 'testObject.foo');
    });

    test('fooBinding: .bar should bind to relative path', function(assert) {
      run(() => {
        assert.expectDeprecation(() => {
          // create binding
          testObject = TestObject.extend({
            fooBinding: 'bar'
          }).create();
        }, /`Ember.Binding` is deprecated/);

        // now make a change to see if the binding triggers.
        set(testObject, 'bar', 'changedValue');
      });

      assert.equal('changedValue', get(testObject, 'foo'), 'testObject.foo');
    });

    test('fooBinding: TestNamespace.fromObject.bar should follow absolute path', function(assert) {
      run(() => {
        assert.expectDeprecation(() => {
          // create binding
          testObject = TestObject.extend({
            fooBinding: 'TestNamespace.fromObject.bar'
          }).create();
        }, /`Ember.Binding` is deprecated/);

        // now make a change to see if the binding triggers.
        set(fromObject, 'bar', 'changedValue');
      });

      assert.equal('changedValue', get(testObject, 'foo'), 'testObject.foo');
    });
  });

  module('rendering', function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(assert) {
      this.assertText = function(expectedText) {
         assert.strictEqual(this.element.textContent, expectedText, `content should be: \`${expectedText}\``);
      };
    });

    test('should accept bindings as a string or an Ember.Binding', async function() {
      let FooBarComponent = Component.extend({
        twoWayTestBinding: Ember.Binding.from('direction'),
        stringTestBinding: 'direction',
        twoWayObjectTestBinding: Ember.Binding.from('displacement.distance'),
        stringObjectTestBinding: 'displacement.distance'
      });

      this.owner.register('component:foo-bar', FooBarComponent);
      this.owner.register('template:components/foo-bar', hbs`two way: {{twoWayTest}}, string: {{stringTest}}, object: {{twoWayObjectTest}}, string object: {{stringObjectTest}}`);

      this.set('direction', 'down');
      this.set('displacement', { distance: 10 });

      await render(hbs`{{foo-bar direction=direction displacement=displacement}}`);

      this.assertText('two way: down, string: down, object: 10, string object: 10');

      this.set('direction', 'up');

      this.assertText('two way: up, string: up, object: 10, string object: 10');

      this.set('displacement.distance', 20);

      this.assertText('two way: up, string: up, object: 20, string object: 20');

      run(() => {
        set(this, 'direction', 'right');
        set(this, 'displacement.distance', 30);
      });

      this.assertText('two way: right, string: right, object: 30, string object: 30');

      run(() => {
        set(this, 'direction', 'down');
        set(this, 'displacement', { distance: 10 });
      });

      this.assertText('two way: down, string: down, object: 10, string object: 10');
    });
  });
});
