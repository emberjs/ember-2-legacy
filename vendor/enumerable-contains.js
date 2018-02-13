(function () {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_ENUMERABLE_CONTAINS_SUPPORT !== true) {
    return false;
  }

  const contexts = [];

  function popCtx() {
    return contexts.length === 0 ? {} : contexts.pop();
  }

  function pushCtx(ctx) {
    contexts.push(ctx);
    return null;
  }

  _Ember.Enumerable.reopen({
    // This method was moved off of Enumberable with (https://github.com/emberjs/ember.js/pull/16131)
    find(callback, target) {
      _Ember.assert('Enumerable#find expects a function as first argument.', typeof callback === 'function');

      let len = _Ember.get(this, 'length');

      if (target === undefined) {
        target = null;
      }

      let context = popCtx();
      let found = false;
      let last = null;
      let next, ret;

      for (let idx = 0; idx < len && !found; idx++) {
        next = this.nextObject(idx, last, context);

        found = callback.call(target, next, idx, this);
        if (found) {
          ret = next;
        }

        last = next;
      }

      next = last = null;
      context = pushCtx(context);

      return ret;
    },

    contains(obj) {
      _Ember.deprecate(
        '`Enumerable#contains` is deprecated, use `Enumerable#includes` instead.',
        false,
        { id: 'ember-runtime.enumerable-contains', until: '3.0.0', url: 'https://emberjs.com/deprecations/v2.x#toc_enumerable-contains' }
      );

      let found = this.find(item => item === obj);
      return found !== undefined;
    }
  });
})();
