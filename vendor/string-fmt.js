(function () {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_STRING_FMT_SUPPORT !== true) {
    return false;
  }

  if (_Ember.String.hasOwnProperty('fmt') === true) {
    return false;
  }

  function _fmt(str, formats) {
    let cachedFormats = formats;

    if (!Ember.isArray(cachedFormats) || arguments.length > 2) {
      cachedFormats = new Array(arguments.length - 1);

      for (let i = 1; i < arguments.length; i++) {
        cachedFormats[i - 1] = arguments[i];
      }
    }

    // first, replace any ORDERED replacements.
    let idx = 0; // the current index for non-numerical replacements
    return str.replace(/%@([0-9]+)?/g, (s, argIndex) => {
      argIndex = (argIndex) ? parseInt(argIndex, 10) - 1 : idx++;
      s = cachedFormats[argIndex];
      return (s === null) ? '(null)' : (s === undefined) ? '' : inspect(s);
    });
  }

  /**
    Apply formatting options to the string. This will look for occurrences
    of "%@" in your string and substitute them with the arguments you pass into
    this method. If you want to control the specific order of replacement,
    you can add a number after the key as well to indicate which argument
    you want to insert.

    Ordered insertions are most useful when building loc strings where values
    you need to insert may appear in different orders.

    ```javascript
    "Hello %@ %@".fmt('John', 'Doe');     // "Hello John Doe"
    "Hello %@2, %@1".fmt('John', 'Doe');  // "Hello Doe, John"
    ```

    @method fmt
    @param {String} str The string to format
    @param {Array} formats An array of parameters to interpolate into string.
    @return {String} formatted string
    @public
    @deprecated Use ES6 template strings instead: http://babeljs.io/docs/learn-es2015/#template-strings
  */
  function fmt() {
    _Ember.deprecate(
      'Ember.String.fmt is deprecated, use ES6 template strings instead.',
      false,
      { id: 'ember-string-utils.fmt', until: '3.0.0', url: 'http://babeljs.io/docs/learn-es2015/#template-strings' }
    );
    return _fmt(...arguments);
  }

  if (EmberENV.EXTEND_PROTOTYPES.String) {
    /**
      See [Ember.String.fmt](/api/classes/Ember.String.html#method_fmt).

      @method fmt
      @for @ember/string
      @static
      @private
      @deprecated
    */
    String.prototype.fmt = function (...args) {
      return fmt(this, args);
    };
  }

  Object.defineProperty(_Ember.String, 'fmt', {
    get: fmt
  });
})();
