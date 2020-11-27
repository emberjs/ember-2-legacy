# Ember 2 Legacy

During the 2.x series in Ember.JS [serveral deprecations were added](https://www.emberjs.com/deprecations/v2.x/) with a target removal version of 3.0. This addon adds back those deprecations and the deprecated code that was removed. The goal of this addon is to allow Ember users who have deprecations that are preventing them from upgrading to 3.0 a path forward. **After Ember 3.4 is released this addon will no longer be compatible with Ember**. It should be used to provide extra time for migrating away from deprecations, not as a permanent solution.

For more background about what and why APIs are being remove for Ember.JS 3.0 please check out the [Road to Ember 3.0](https://emberjs.com/blog/2017/10/03/the-road-to-ember-3-0.html#toc_api-removals-in-3-0) blog post which goes into more details.

## Installation

```
ember install ember-2-legacy
```

## What Deprecations are Covered

All [deprecations found here](https://www.emberjs.com/deprecations/v2.x/) which have a `until: 3.0.0` are currently supported by this addon.

In `ember-cli-build.js` you can specify a config for `ember-2-legacy`. This object has individual flags as key names and they can be turned off simply by setting a flag to `false`. Below is a sample config which shows all of the flag names (note all are `true` by default):

```js
new EmberApp(defaults, {
  'ember-2-legacy': {
    'ember-k': false,
    'ember-required': false,
    'safe-string': false,
    'enumerable-contains': false,
    'underscore-actions': false,
    'reversed-observer-args': false,
    'initializer-arity': false,
    'router-resouce': false,
    'current-when': false,
    'controller-wrapped': false,
    'application-registry': false,
    'immediate-observer': false,
    'string-fmt': false,
    'ember-freezable': false,
    'component-defaultLayout': false,
    'ember-binding': false,
    'input-transform': false,
    'deprecation-options': false,
    'orphaned-outlets': false,
    'warn-options': false,
    'resolver-function': false,
    'init-attrs': false,
    'render-support': false,
    'property-required': false
  }
});
```
