import Route from '@ember/routing/route';

export default Route.extend({
  bazbar: null,

  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  _actions: {
    foobar() {
      this.set('bazbar', 'helloworld');
    }
  }
  /* eslint-enable ember/avoid-leaking-state-in-ember-objects */
});
