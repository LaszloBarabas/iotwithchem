'use strict'

let mongoose = require('mongoose'),
	Schema = mongoose.Schema

let phSchema = new Schema({
	raspberryid : String,
	sensorid : String,
	phvalue : String,
	phdate : String
})

module.exports = mongoose.model('Ph', phSchema)
