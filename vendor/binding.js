(() => {

const {
  Logger,
  ENV,
  lookup,
  guidFor,
  run,
  assert,
  deprecate,
  get,
  trySet,
  addListener,
  addObserver,
  removeObserver,
  _Cache: Cache,
  meta: metaFor,
  beginPropertyChanges,
  endPropertyChanges,
} = Ember;

/*
 *  This following code was removed (https://github.com/emberjs/ember.js/pull/16162) and needs to be
 *  brought over since Ember._suspendObserver no longer exists.
 */

function pushUniqueListener(destination, source, index) {
  let target = source[index + 1];
  let method = source[index + 2];
  for (let destinationIndex = 0; destinationIndex < destination.length; destinationIndex += 3) {
    if (destination[destinationIndex] === target && destination[destinationIndex + 1] === method) {
      return;
    }
  }
  destination.push(target, method, source[index + 3]);
}

function polyfilledMetaFor(obj) {
  let meta = metaFor(obj);

  meta._suspendedListeners = undefined;

  meta.matchingListeners = function(eventName) {
    let pointer = this;
    let result;
    while (pointer !== undefined) {
      let listeners = pointer._listeners;
      if (listeners !== undefined) {
        for (let index = 0; index < listeners.length; index += 4) {
          if (listeners[index] === eventName) {
            result = result || [];
            pushUniqueListener(result, listeners, index);
          }
        }
      }
      if (pointer._listenersFinalized) { break; }
      pointer = pointer.parent;
    }
    let sus = this._suspendedListeners;
    if (sus !== undefined && result !== undefined) {
      for (let susIndex = 0; susIndex < sus.length; susIndex += 3) {
        if (eventName === sus[susIndex]) {
          for (let resultIndex = 0; resultIndex < result.length; resultIndex += 3) {
            if (result[resultIndex] === sus[susIndex + 1] && result[resultIndex + 1] === sus[susIndex + 2]) {
              result[resultIndex + 2] |= SUSPENDED;
            }
          }
        }
      }
    }
    return result;
  }

  meta.suspendListeners = function(eventNames, target, method, callback) {
    let sus = this._suspendedListeners;
    if (sus === undefined) {
      sus = this._suspendedListeners = [];
    }
    for (let i = 0; i < eventNames.length; i++) {
      sus.push(eventNames[i], target, method);
    }
    try {
      return callback.call(target);
    } finally {
      if (sus.length === eventNames.length) {
        this._suspendedListeners = undefined;
      } else {
        for (let i = sus.length - 3; i >= 0; i -= 3) {
          if (sus[i + 1] === target && sus[i + 2] === method && eventNames.indexOf(sus[i]) !== -1) {
            sus.splice(i, 3);
          }
        }
      }
    }
  }

  return meta;
}

const AFTER_OBSERVERS = ':change';
function changeEvent(keyName) {
  return keyName + AFTER_OBSERVERS;
}

function suspendListener(obj, eventName, target, method, callback) {
  return suspendListeners(obj, [eventName], target, method, callback);
}

function suspendListeners(obj, eventNames, target, method, callback) {
  if (!method && 'function' === typeof target) {
    method = target;
    target = null;
  }

  return polyfilledMetaFor(obj).suspendListeners(eventNames, target, method, callback);
}

function _suspendObserver(obj, path, target, method, callback) {
  return suspendListener(obj, changeEvent(path), target, method, callback);
}

function _suspendObservers(obj, paths, target, method, callback) {
  let events = paths.map(changeEvent);
  return suspendListeners(obj, events, target, method, callback);
}

/*
 * End of code brought over for missing Ember._suspendObserver.
 */

const IS_GLOBAL_PATH = /^[A-Z$].*[.]/;

const isGlobalPathCache  = new Cache(1000, key => IS_GLOBAL_PATH.test(key));
const firstDotIndexCache = new Cache(1000, key => key.indexOf('.'));

const firstKeyCache = new Cache(1000, (path) => {
  let index = firstDotIndexCache.get(path);
  return index === -1 ? path : path.slice(0, index);
});

const tailPathCache = new Cache(1000, (path) => {
  let index = firstDotIndexCache.get(path);
  return index === -1 ? undefined : path.slice(index + 1);
});

function isGlobalPath(path) {
  return isGlobalPathCache.get(path);
}

function getFirstKey(path) {
  return firstKeyCache.get(path);
}

function getTailPath(path) {
  return tailPathCache.get(path);
}

// ..........................................................
// BINDING
//

class Binding {
  constructor(toPath, fromPath) {
    // Configuration
    this._from = fromPath;
    this._to = toPath;
    this._oneWay = undefined;

    // State
    this._direction = undefined;
    this._readyToSync = undefined;
    this._fromObj = undefined;
    this._fromPath = undefined;
    this._toObj = undefined;
  }

  /**
    @class Binding
    @namespace Ember
    @deprecated See https://emberjs.com/deprecations/v2.x#toc_ember-binding
    @public
  */

  /**
    This copies the Binding so it can be connected to another object.

    @method copy
    @return {Ember.Binding} `this`
    @public
  */
  copy() {
    let copy = new Binding(this._to, this._from);
    if (this._oneWay) { copy._oneWay = true; }
    return copy;
  }

  // ..........................................................
  // CONFIG
  //

  /**
    This will set `from` property path to the specified value. It will not
    attempt to resolve this property path to an actual object until you
    connect the binding.

    The binding will search for the property path starting at the root object
    you pass when you `connect()` the binding. It follows the same rules as
    `get()` - see that method for more information.

    @method from
    @param {String} path The property path to connect to.
    @return {Ember.Binding} `this`
    @public
  */
  from(path) {
    this._from = path;
    return this;
  }

  /**
    This will set the `to` property path to the specified value. It will not
    attempt to resolve this property path to an actual object until you
    connect the binding.

    The binding will search for the property path starting at the root object
    you pass when you `connect()` the binding. It follows the same rules as
    `get()` - see that method for more information.

    @method to
    @param {String|Tuple} path A property path or tuple.
    @return {Ember.Binding} `this`
    @public
  */
  to(path) {
    this._to = path;
    return this;
  }

  /**
    Configures the binding as one way. A one-way binding will relay changes
    on the `from` side to the `to` side, but not the other way around. This
    means that if you change the `to` side directly, the `from` side may have
    a different value.

    @method oneWay
    @return {Ember.Binding} `this`
    @public
  */
  oneWay() {
    this._oneWay = true;
    return this;
  }

  /**
    @method toString
    @return {String} string representation of binding
    @public
  */
  toString() {
    let oneWay = this._oneWay ? '[oneWay]' : '';
    return `Ember.Binding<${guidFor(this)}>(${this._from} -> ${this._to})${oneWay}`;
  }

  // ..........................................................
  // CONNECT AND SYNC
  //

  /**
    Attempts to connect this binding instance so that it can receive and relay
    changes. This method will raise an exception if you have not set the
    from/to properties yet.

    @method connect
    @param {Object} obj The root object for this binding.
    @return {Ember.Binding} `this`
    @public
  */
  connect(obj) {
    assert('Must pass a valid object to Ember.Binding.connect()', !!obj);

    let fromObj, fromPath, possibleGlobal;

    // If the binding's "from" path could be interpreted as a global, verify
    // whether the path refers to a global or not by consulting `Ember.lookup`.
    if (isGlobalPath(this._from)) {
      let name = getFirstKey(this._from);
      possibleGlobal = lookup[name];

      if (possibleGlobal) {
        fromObj = possibleGlobal;
        fromPath = getTailPath(this._from);
      }
    }

    if (fromObj === undefined) {
      fromObj = obj;
      fromPath = this._from;
    }

    trySet(obj, this._to, get(fromObj, fromPath));

    // Add an observer on the object to be notified when the binding should be updated.
    addObserver(fromObj, fromPath, this, 'fromDidChange');

    // If the binding is a two-way binding, also set up an observer on the target.
    if (!this._oneWay) {
      addObserver(obj, this._to, this, 'toDidChange');
    }

    addListener(obj, 'willDestroy', this, 'disconnect');

    fireDeprecations(
      obj,
      this._to,
      this._from,
      possibleGlobal,
      this._oneWay,
      (!possibleGlobal && !this._oneWay)
    );

    this._readyToSync = true;
    this._fromObj = fromObj;
    this._fromPath = fromPath;
    this._toObj = obj;

    return this;
  }

  /**
    Disconnects the binding instance. Changes will no longer be relayed. You
    will not usually need to call this method.

    @method disconnect
    @return {Ember.Binding} `this`
    @public
  */
  disconnect() {
    assert('Must pass a valid object to Ember.Binding.disconnect()', !!this._toObj);

    // Remove an observer on the object so we're no longer notified of
    // changes that should update bindings.
    removeObserver(this._fromObj, this._fromPath, this, 'fromDidChange');

    // If the binding is two-way, remove the observer from the target as well.
    if (!this._oneWay) {
      removeObserver(this._toObj, this._to, this, 'toDidChange');
    }

    this._readyToSync = false; // Disable scheduled syncs...
    return this;
  }

  // ..........................................................
  // PRIVATE
  //

  /* Called when the from side changes. */
  fromDidChange(target) { // eslint-disable-line no-unused-vars
    this._scheduleSync('fwd');
  }

  /* Called when the to side changes. */
  toDidChange(target) { // eslint-disable-line no-unused-vars
    this._scheduleSync('back');
  }

  _scheduleSync(dir) {
    let existingDir = this._direction;

    // If we haven't scheduled the binding yet, schedule it.
    if (existingDir === undefined) {
      run.schedule('sync', this, '_sync');
      this._direction  = dir;
    }

    // If both a 'back' and 'fwd' sync have been scheduled on the same object,
    // default to a 'fwd' sync so that it remains deterministic.
    if (existingDir === 'back' && dir === 'fwd') {
      this._direction = 'fwd';
    }
  }

  _sync() {
    let log = ENV.LOG_BINDINGS;

    let toObj = this._toObj;

    // Don't synchronize destroyed objects or disconnected bindings.
    if (toObj.isDestroyed || !this._readyToSync) { return; }

    // Get the direction of the binding for the object we are
    // synchronizing from.
    let direction = this._direction;

    let fromObj = this._fromObj;
    let fromPath = this._fromPath;

    this._direction = undefined;

    // If we're synchronizing from the remote object...
    if (direction === 'fwd') {
      let fromValue = get(fromObj, fromPath);
      if (log) {
        Logger.log(' ', this.toString(), '->', fromValue, fromObj);
      }
      if (this._oneWay) {
        trySet(toObj, this._to, fromValue);
      } else {
        _suspendObserver(toObj, this._to, this, 'toDidChange', function() {
          trySet(toObj, this._to, fromValue);
        });
      }
    // If we're synchronizing *to* the remote object.
    } else if (direction === 'back') {
      let toValue = get(toObj, this._to);
      if (log) {
        Logger.log(' ', this.toString(), '<-', toValue, toObj);
      }
      _suspendObserver(fromObj, fromPath, this, 'fromDidChange', () => {
        trySet(fromObj, fromPath, toValue);
      });
    }
  }
}

function fireDeprecations(obj, toPath, fromPath, deprecateGlobal, deprecateOneWay, deprecateAlias) {
  let deprecateGlobalMessage = '`Ember.Binding` is deprecated. Since you' +
    ' are binding to a global consider using a service instead.';
  let deprecateOneWayMessage = '`Ember.Binding` is deprecated. Since you' +
    ' are using a `oneWay` binding consider using a `readOnly` computed' +
    ' property instead.';
  let deprecateAliasMessage = '`Ember.Binding` is deprecated. Consider' +
    ' using an `alias` computed property instead.';

  let objectInfo = `The \`${toPath}\` property of \`${obj}\` is an \`Ember.Binding\` connected to \`${fromPath}\`, but `;
  deprecate(objectInfo + deprecateGlobalMessage, !deprecateGlobal, {
    id: 'ember-metal.binding',
    until: '3.0.0',
    url: 'https://emberjs.com/deprecations/v2.x#toc_ember-binding'
  });
  deprecate(objectInfo + deprecateOneWayMessage, !deprecateOneWay, {
    id: 'ember-metal.binding',
    until: '3.0.0',
    url: 'https://emberjs.com/deprecations/v2.x#toc_ember-binding'
  });
  deprecate(objectInfo + deprecateAliasMessage, !deprecateAlias, {
    id: 'ember-metal.binding',
    until: '3.0.0',
    url: 'https://emberjs.com/deprecations/v2.x#toc_ember-binding'
  });
}

function mixinProperties(to, from) {
  for (let key in from) {
    if (from.hasOwnProperty(key)) {
      to[key] = from[key];
    }
  }
}

mixinProperties(Binding, {

  /*
    See `Ember.Binding.from`.

    @method from
    @static
  */
  from(from) {
    let C = this;
    return new C(undefined, from);
  },

  /*
    See `Ember.Binding.to`.

    @method to
    @static
  */
  to(to) {
    let C = this;
    return new C(to, undefined);
  }
});
/**
  An `Ember.Binding` connects the properties of two objects so that whenever
  the value of one property changes, the other property will be changed also.

  ## Automatic Creation of Bindings with `/^*Binding/`-named Properties.

  You do not usually create Binding objects directly but instead describe
  bindings in your class or object definition using automatic binding
  detection.

  Properties ending in a `Binding` suffix will be converted to `Ember.Binding`
  instances. The value of this property should be a string representing a path
  to another object or a custom binding instance created using Binding helpers
  (see "One Way Bindings"):

  ```
  valueBinding: "MyApp.someController.title"
  ```

  This will create a binding from `MyApp.someController.title` to the `value`
  property of your object instance automatically. Now the two values will be
  kept in sync.

  ## One Way Bindings

  One especially useful binding customization you can use is the `oneWay()`
  helper. This helper tells Ember that you are only interested in
  receiving changes on the object you are binding from. For example, if you
  are binding to a preference and you want to be notified if the preference
  has changed, but your object will not be changing the preference itself, you
  could do:

  ```
  bigTitlesBinding: Ember.Binding.oneWay("MyApp.preferencesController.bigTitles")
  ```

  This way if the value of `MyApp.preferencesController.bigTitles` changes the
  `bigTitles` property of your object will change also. However, if you
  change the value of your `bigTitles` property, it will not update the
  `preferencesController`.

  One way bindings are almost twice as fast to setup and twice as fast to
  execute because the binding only has to worry about changes to one side.

  You should consider using one way bindings anytime you have an object that
  may be created frequently and you do not intend to change a property; only
  to monitor it for changes (such as in the example above).

  ## Adding Bindings Manually

  All of the examples above show you how to configure a custom binding, but the
  result of these customizations will be a binding template, not a fully active
  Binding instance. The binding will actually become active only when you
  instantiate the object the binding belongs to. It is useful, however, to
  understand what actually happens when the binding is activated.

  For a binding to function it must have at least a `from` property and a `to`
  property. The `from` property path points to the object/key that you want to
  bind from while the `to` path points to the object/key you want to bind to.

  When you define a custom binding, you are usually describing the property
  you want to bind from (such as `MyApp.someController.value` in the examples
  above). When your object is created, it will automatically assign the value
  you want to bind `to` based on the name of your binding key. In the
  examples above, during init, Ember objects will effectively call
  something like this on your binding:

  ```javascript
  binding = Ember.Binding.from("valueBinding").to("value");
  ```

  This creates a new binding instance based on the template you provide, and
  sets the to path to the `value` property of the new object. Now that the
  binding is fully configured with a `from` and a `to`, it simply needs to be
  connected to become active. This is done through the `connect()` method:

  ```javascript
  binding.connect(this);
  ```

  Note that when you connect a binding you pass the object you want it to be
  connected to. This object will be used as the root for both the from and
  to side of the binding when inspecting relative paths. This allows the
  binding to be automatically inherited by subclassed objects as well.

  This also allows you to bind between objects using the paths you declare in
  `from` and `to`:

  ```javascript
  // Example 1
  binding = Ember.Binding.from("App.someObject.value").to("value");
  binding.connect(this);

  // Example 2
  binding = Ember.Binding.from("parentView.value").to("App.someObject.value");
  binding.connect(this);
  ```

  Now that the binding is connected, it will observe both the from and to side
  and relay changes.

  If you ever needed to do so (you almost never will, but it is useful to
  understand this anyway), you could manually create an active binding by
  using the `Ember.bind()` helper method. (This is the same method used by
  to setup your bindings on objects):

  ```javascript
  Ember.bind(MyApp.anotherObject, "value", "MyApp.someController.value");
  ```

  Both of these code fragments have the same effect as doing the most friendly
  form of binding creation like so:

  ```javascript
  MyApp.anotherObject = Ember.Object.create({
    valueBinding: "MyApp.someController.value",

    // OTHER CODE FOR THIS OBJECT...
  });
  ```

  Ember's built in binding creation method makes it easy to automatically
  create bindings for you. You should always use the highest-level APIs
  available, even if you understand how it works underneath.

  @class Binding
  @namespace Ember
  @since Ember 0.9
  @public
*/
// Ember.Binding = Binding; ES6TODO: where to put this?


/**
  Global helper method to create a new binding. Just pass the root object
  along with a `to` and `from` path to create and connect the binding.

  @method bind
  @for Ember
  @param {Object} obj The root object of the transform.
  @param {String} to The path to the 'to' side of the binding.
    Must be relative to obj.
  @param {String} from The path to the 'from' side of the binding.
    Must be relative to obj or a global path.
  @return {Ember.Binding} binding instance
  @public
*/
function bind(obj, to, from) {
  return new Binding(to, from).connect(obj);
}

Ember.bind = bind;
Ember.Binding = Binding;


function detectBinding(key) {
  let length = key.length;

  return length > 7 && key.charCodeAt(length - 7) === 66 && key.indexOf('inding', length - 6) !== -1;
}
// warm both paths of above function
detectBinding('notbound');
detectBinding('fooBinding');

function connectBindings(obj, meta) {
  // TODO Mixin.apply(instance) should disconnect binding if exists
  meta.forEachBindings((key, binding) => {
    if (binding) {
      let to = key.slice(0, -7); // strip Binding off end
      if (binding instanceof Binding) {
        binding = binding.copy(); // copy prototypes' instance
        binding.to(to);
      } else { // binding is string path
        binding = new Binding(to, binding);
      }
      binding.connect(obj);
      obj[key] = binding;
    }
  });
  // mark as applied
  meta.clearBindings();
}

function finishPartial(obj, meta) {
  connectBindings(obj, meta === undefined ? polyfilledMetaFor(obj) : meta);
  return obj;
}

function updateRunloopQueues() {
  if (run.queues.indexOf('sync') === -1) {
    run.queues.unshift('sync');
    run.backburner.options.sync = {
      before: beginPropertyChanges,
      after: endPropertyChanges,
    };
  }
}

Ember.CoreObject.reopen({
  bind(to, from) {
    if (!(from instanceof Binding)) { from = Binding.from(from); }
    from.to(to).connect(this);
    return from;
  },
});

Ember.Mixin.finishPartial = finishPartial;
Ember.Mixin.detectBinding = detectBinding;
updateRunloopQueues();

})();
