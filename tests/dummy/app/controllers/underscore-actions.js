import Controller from '@ember/controller';

export default Controller.extend({
  bazbar: null,

  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  _actions: {
    foobar() {
      this.set('bazbar', 'helloworld');
    }
  }
  /* eslint-enable ember/avoid-leaking-state-in-ember-objects */
});
