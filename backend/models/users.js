'use strict'

let mongoose = require('mongoose'),
    Schema = mongoose.Schema

let userSchema = new Schema({
  userName : String
})

module.exports = mongoose.model('Users', userSchema)
