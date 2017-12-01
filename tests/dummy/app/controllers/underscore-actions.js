import Controller from '@ember/controller';

export default Controller.extend({
  bazbar: null,

  _actions: {
    foobar() {
      this.set('bazbar', 'helloworld');
    }
  }
});
