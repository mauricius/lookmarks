'use strict'

const GE = require('@adonisjs/generic-exceptions')

class Truncate {

  register (Model, options) {
    if (!options || typeof (options) !== 'object') {
      throw GE.InvalidArgumentException.invalidParameter('Make sure to pass options object as 2nd parameter to Truncate trait')
    }

    if (!options.fields) {
      throw GE.InvalidArgumentException.invalidParameter('Make sure to pass fields under options object to Truncate trait')
    }

    Model.addHook('beforeSave', function (modelInstance) {
      const fields = Object.keys(options.fields)

      fields.forEach(function (field) {
        modelInstance.$attributes[field] = modelInstance.$attributes[field].substr(0, options.fields[field])
      })
    })
  }
}

module.exports = Truncate
