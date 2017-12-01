import Route from '@ember/routing/route';

export default Route.extend({
  bar: null,

  actions: {
    foo() {
      return 'helloworld';
    }
  }
});
