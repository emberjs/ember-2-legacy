# Ember 2 Legacy

During the 2.x series in Ember.JS [serveral deprecations were added](https://www.emberjs.com/deprecations/v2.x/) with a target removal version of 3.0. This addon adds back those deprecations and the
deprecated code that was removed. The goal of this addon is to allow Ember users who have deprecations that are preventing them from upgrading to 3.0 a path forward. **After Ember 3.4 is released this
addon will no longer be compatible with Ember**. It should be used to provide extra time for migrating away from deprecations, not as a permanent solution.

For more background about what and why APIs are being remove for Ember.JS 3.0 please check out the [Road to Ember 3.0](https://emberjs.com/blog/2017/10/03/the-road-to-ember-3-0.html#toc_api-removals-in-3-0) blog
post which goes into more details.

## Installation

```
ember install ember-2-legacy
```

## What Deprecations are Covered

All [deprecations found here](https://www.emberjs.com/deprecations/v2.x/) which have a `until: 3.0.0` are currently supported by this addon.
