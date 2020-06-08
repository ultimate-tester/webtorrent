var finalhandler = require('finalhandler')
var fixtures = require('webtorrent-fixtures')
var http = require('http')
var MemoryChunkStore = require('memory-chunk-store')
var path = require('path')
var series = require('run-series')
var serveStatic = require('serve-static')
var test = require('tape')
var WebTorrent = require('../../')

const TORRENT_URL = 'https://webtorrent.io/torrents/sintel.torrent'

test('Download using URL (to .torrent file)', function (t) {
  t.plan(3)

  var client

  series([

    function (cb) {
      client = new WebTorrent()

      client.on('error', function (err) { t.fail(err) })
      client.on('warning', function (err) { t.fail(err) })

      client.on('torrent', function () {
        const torrent = client.get(TORRENT_URL)

        if (!!torrent) {
          t.pass('torrent successfully parsed and retrieved')
        } else {
          t.fail('torrent not found')
        }

        cb()
      })

      client.add(TORRENT_URL, { store: MemoryChunkStore })
    }
  ], function (err) {
    t.error(err)
    client.destroy(function (err) {
      t.error(err, 'client destroyed')
    })
  })
})