import Component from '@ember/component';

export default Component.extend({
  bazbar: null,

  _actions: {
    foobar() {
      this.set('bazbar', 'helloworld');
    }
  }
});
