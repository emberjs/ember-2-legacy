import Route from '@ember/routing/route';

export default Route.extend({
  bazbar: null,

  _actions: {
    foobar() {
      this.set('bazbar', 'helloworld');
    }
  }
});
