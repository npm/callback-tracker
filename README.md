# callback-tracker

Track your callbacks.

This module is designed to help make sure that callback functions are
called before exit, and not before you are done with them.

If they are called prematurely, then an error will be thrown.

If they are not called before exit, then the tracking info will be
reported on stderr for your debugging convenience.

This module is designed to help debug the `cb() never called!` error
that happens in some cases when a bug in npm prevents it from
completing all operations.

## USAGE

```javascript
var cbTracker = require('callback-tracker')

function someMethodOfMine(args, cb) {
  // set up the tracking device
  // cbTracker(cb, tagline)
  // tagline should ideally be unique to this *call*
  // but that is not essential.  What's important is to provide
  // enough details that you'll know wtf it was trying to do.
  cb = cbTracker('some-method:' + args.join(':'), cb)

  cb.track('start')
  fs.readFile('some-file', function (er, data) {
    cb.track('read the file')
    if (er) return cb(er)
    doSomethingWithData(data, function (er, res) {
      cb.track('did stuff with data')
      cb(er, res)
    })
  })
}
```

If the callback is not called before `process.on('exit')`, it'll print
out a log of how far along it got.

If any `cb.track()` calls are made *after* the callback, then it'll
throw an error and crash immediately.

The `cb.track()` function takes the same arguments and formats things
like `console.log` and the like.

## API

* `trackCb(options, callback)`  Returns a tracked callback.  Tracked
  callbacks have a `cb.track()` method, and a `cb.key` property.
* `trackCb.print()` Dump currently in-progress trackers.
* `trackCb.pretty()` Return a prettified string of the trackers in
  progress.

## Options

The second argument to `track-callback` is an options object which can
contain the following fields:

* `track` If set to false, then don't track stuff.  This allows
  conditionally tracking cb's based on an env var or whatever.
* `key` A key to use to track this callback.  If already in use, then
  a number will be appended to the end.


