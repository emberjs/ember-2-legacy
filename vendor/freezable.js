(function() {
  var _Ember;
  if (typeof Ember !== 'undefined') {
    _Ember = Ember;
  } else {
    _Ember = require('ember').default;
  }

  if (EmberENV && EmberENV._ENABLE_FREEZABLE_SUPPORT !== true) {
    return false;
  }

  _Ember.Freezable = _Ember.Mixin.create({
    init() {
      _Ember.deprecate(
        '`Ember.Freezable` is deprecated, use `Object.freeze` instead.',
        false,
        { id: 'ember-runtime.freezable-init', until: '3.0.0' }
      );
      this._super(...arguments);
    },

    isFrozen: false,

    freeze() {
      if (_Ember.get(this, 'isFrozen')) {
        return this;
      }

      _Ember.set(this, 'isFrozen', true);
      return this;
    }
  });

  _Ember.FROZEN_ERROR = 'Frozen object cannot be modified.';

  _Ember.NativeArray.reopen({
    replace() {
      _Ember.assert(_Ember.FROZEN_ERROR, !this.isFrozen);
      this._super.apply(this, arguments);
    }
  });

  _Ember.Copyable.reopen({
    frozenCopy() {
      _Ember.deprecate(
        '`frozenCopy` is deprecated, use `Object.freeze` instead.',
        false,
        { id: 'ember-runtime.frozen-copy', until: '3.0.0' }
      );
      if (_Ember.Freezable && _Ember.Freezable.detect(this)) {
        return _Ember.get(this, 'isFrozen') ? this : this.copy().freeze();
      } else {
        throw new _Ember.Error(`${this} does not support freezing`);
      }
    }
  });
})();
