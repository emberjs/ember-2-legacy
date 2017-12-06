(function() {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_REVERSED_OBSERVER_SUPPORT !== true) {
    return false;
  }

  var originalObserver = _Ember.observer;

  _Ember.observer = function() {
    var args = Array.prototype.slice.call(arguments);

    if (typeof args[args.length - 1] !== 'function') {
      _Ember.deprecate(
        'Passing the dependentKeys after the callback function in observer is deprecated. Ensure the callback function is the last argument.',
        false,
        {
          id: 'ember-metal.observer-argument-order',
          until: '3.0.0'
        }
      );

      var func = args.shift(); // grab the "first" argument
      args.push(func); // move it to the end of the array
    }

    return originalObserver.apply(this, args);
  }
})();
