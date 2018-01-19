(() => {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_INPUT_TRANSFORM_SUPPORT !== true) {
    return false;
  }

  function sendAction(eventName, view, event) {
    let action = _Ember.get(view, `attrs.${eventName}`) || _Ember.get(view, eventName);
    let on = _Ember.get(view, 'onEvent');
    let value = _Ember.get(view, 'value');

    // back-compat support for keyPress as an event name even though
    // it's also a method name that consumes the event (and therefore
    // incompatible with sendAction semantics).
    if (on === eventName || (on === 'keyPress' && eventName === 'key-press')) {
      view.sendAction('action', value);
    }

    view.sendAction(eventName, value);

    if (action || on === eventName) {
      if (!_Ember.get(view, 'bubbles')) {
        event.stopPropagation();
      }
    }
  }

  _Ember.TextSupport.reopen({
    insertNewline(event) {
      sendAction('enter', this, event);
      sendAction('insert-newline', this, event);
    },

    cancel(event) {
      sendAction('escape-press', this, event);
    },

    focusIn(event) {
      sendAction('focus-in', this, event);
    },

    focusOut(event) {
      this._elementValueDidChange(event);
      sendAction('focus-out', this, event);
    },

    keyPress(event) {
      sendAction('key-press', this, event);
    },

    /**
      The action to be sent when the user presses the return key.

      This is similar to the `{{action}}` helper, but is fired when
      the user presses the return key when editing a text field, and sends
      the value of the field as the context.

      @property action
      @type String
      @default null
      @private
    */
    action: null,

    /**
      The event that should send the action.

      Options are:

      * `enter`: the user pressed enter
      * `keyPress`: the user pressed a key

      @property onEvent
      @type String
      @default enter
      @private
    */
    onEvent: 'enter'
  });
})();
