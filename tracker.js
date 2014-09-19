var wrappy = require('wrappy')

var util = require('util')
var tracks = {}

tracker.print = function () {
  if (Object.keys(tracks).length)
    console.error(tracker.pretty())
}

tracker.pretty = function pretty () {
  return Object.keys(tracks).reduce(function (m, key) {
    return m.concat('# ' + key).concat(tracks[key].map(function (msg) {
      return '    ' + msg
    }))
  }, []).join('\n') + '\n'
}

process.on('exit', function () {
  tracker.print()
})

module.exports = wrappy(tracker)
function tracker (options, cb) {
  if (typeof options === 'string')
    options = { key: options }

  if (typeof cb !== 'function')
    throw new Error('No callback to track')

  if (typeof options.key !== 'string' || !options.key)
    throw new Error('key option is required')

  var called = false

  // Make sure to get a unique id per call.
  var key = options.key
  var id = 0
  while (tracks.hasOwnProperty(key))
    key = options.key + '_' + (++id)

  trackedCb.key = key
  trackedCb.track = track

  return trackedCb

  function trackedCb () {
    if (called)
      throw new Error('Called cb() more than once: ' + key)

    called = true
    delete tracks[key]

    return cb.apply(this, arguments)
  }

  function track () {
    var message = util.format.apply(util, arguments)
    if (called) {
      throw new Error('Called cb.track() after calling cb\n' +
                      key + '\n' + message)
    }

    if (options.track !== false) {
      tracks[key] = tracks[key] || []
      tracks[key].push(message)
    }
  }
}
