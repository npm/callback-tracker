var test = require('tap').test
var util = require('util')
var trackCb = require('../tracker.js')

test('basic', function (t) {
  var expect = [
    ["CALLED 1"],
    [{"testing_1":[
      "starting 2",
      "called the first cb",
      "did the throw tests"
    ]}]
  ]
  var ce = console.error

  var stderr = []
  console.error = function () {
    stderr.push([].slice.call(arguments))
  }

  var cb = trackCb(function () {
    console.error('CALLED 1')
  }, { key: 'testing' })

  cb.track('starting')

  var cb2 = trackCb(function () {
    console.error('CALLED 2')
  }, { key: 'testing' })

  t.equal(cb.key, 'testing')
  t.equal(cb2.key, 'testing_1')

  cb2.track('starting 2')

  cb.track('another thing')

  cb()

  cb2.track('called the first cb')

  t.throws(function () {
    cb()
  })

  t.throws(function () {
    cb.track('x')
  })

  cb2.track('did the throw tests')

  trackCb.print()

  t.same(stderr, expect)

  // reset
  stderr = []

  // now cleanup
  cb2()
  t.same(stderr, [ [ 'CALLED 2' ] ])

  console.error = function () {
    throw new Error('should not be printing any more')
  }

  t.end()
})
