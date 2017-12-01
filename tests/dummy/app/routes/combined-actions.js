import Route from '@ember/routing/route';

export default Route.extend({
  bar: null,
  bazbar: null,

  actions: {
    foo() {
      this.set('bar', 'helloworld');
    }
  },

  _actions: {
    foobar() {
      this.set('barbaz', 'helloworld');
    }
  }
});
