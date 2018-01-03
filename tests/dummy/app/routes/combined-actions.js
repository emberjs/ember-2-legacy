import Route from '@ember/routing/route';

export default Route.extend({
  bar: null,
  bazbar: null,

  actions: {
    foo() {
      this.set('bar', 'helloworld');
    }
  },

  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  _actions: {
    foobar() {
      this.set('barbaz', 'helloworld');
    }
  }
  /* eslint-enable ember/avoid-leaking-state-in-ember-objects */
});
