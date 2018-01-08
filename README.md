# Ember 2 Legacy

During the 2.x series in Ember.JS [serveral deprecations were added](https://www.emberjs.com/deprecations/v2.x/) with a target removal version of 3.0. This addon adds back those deprecations and the
deprecated code that was removed. The goal of this addon is to allow Ember users who have deprecations that are preventing them from
upgrading to 3.0 a path forward. **After Ember 3.4 is released this addon will no longer be compatible with Ember**. It should be used to provide extra time for migrating away from views, not as a permanent solution.

For more background about what and why APIs are being remove for Ember.JS 3.0 please check out the [Road to Ember 3.0](https://emberjs.com/blog/2017/10/03/the-road-to-ember-3-0.html#toc_api-removals-in-3-0) blog
post which goes into more details.

## Installation

```
ember install ember-2-legacy
```

## What Deprecations are Covered

All [deprecations found here](https://www.emberjs.com/deprecations/v2.x/) which have a `until: 3.0.0` are currently supported by this addon.

## How to Disable Certain Deprecations

All deprecations are controlled by environment variables that can be toggled on or off. By default all deprecations are `on`. You should ideally turn off all deprecations that
your app is not currently hitting to be sure that you are able to move off of this addon when the time comes.

An example of how to configure these in your app:

```js
// config/environment.js

module.exports = function(environment) {
  let ENV = {
    // ...
    EmberENV: {
      // ...

      _ENABLE_EMBER_K_SUPPORT: false,
      _ENABLE_UNDERSCORE_ACTIONS_SUPPORT: false,
      // etc...
    }
  };

  // ...
  return ENV;
};

```
**NOTE** that changes to your config may need your server to be restarted before seeing the changes.

To view all flags and which deprecations they control [click here](https://github.com/emberjs/ember-2-legacy/blob/master/config/environment.js).
