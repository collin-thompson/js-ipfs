'use strict'

const promisify = require('promisify-es6')
const get = require('lodash.get')
const set = require('lodash.set')

module.exports = function config (self) {
  return {
    get: promisify((key, callback) => {
      if (typeof key === 'function') {
        callback = key
        key = undefined
      }

      if (!key) {
        return self._repo.config.get(callback)
      }

      if (typeof key !== 'string') {
        return callback(new Error('Invalid key type'))
      }

      self._repo.config.get((err, config) => {
        if (err) {
          return callback(err)
        }

        const val = get(config, key)

        if (val === undefined) {
          return callback(new Error('Key does not exist in config'))
        }

        callback(null, val)
      })
    }),
    set: promisify((key, value, callback) => {
      if (!key || typeof key !== 'string') {
        return callback(new Error('Invalid key type'))
      }

      if (!value || Buffer.isBuffer(value)) {
        return callback(new Error('Invalid value type'))
      }

      self._repo.config.get((err, config) => {
        if (err) {
          return callback(err)
        }

        self.config.replace(
          set(config, key, value),
          callback
        )
      })
    }),
    replace: promisify((config, callback) => {
      self._repo.config.set(config, callback)
    })
  }
}
