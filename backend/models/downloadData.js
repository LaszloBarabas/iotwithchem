'use strict'

let path = require('path'),   
	Temperature = require(path.resolve('backend/models/temperature.js')),
	Alive = require(path.resolve('backend/models/alive.js')),
	mongoose = require('mongoose')

mongoose.Promise = global.Promise

// database connection settings
mongoose.connection.on('open', () => {
	console.info('Connected to mongo server.')
})

mongoose.connection.on('error', (error) => {
	console.error('Could not connect to mongo server!', error)
})

// connect to database on mongolab
mongoose.connect('mongodb://heroku_hww55rc1:2ic4cjhncvmlse83a21lnejpru@ds139187.mlab.com:39187/heroku_hww55rc1',function(err) {
	if (err) console.error('erros:' + err)
}) //('mongodb://votiv:votiv@ds031257.mlab.com:31257/kemia-db')



var lastAliveDate = 0

function getTemperatureSensors(_callback){
       
	var _sensorids = new Set()
	Temperature.find({},'-_id -__v' ,(error, sensors) => {
		if (error) { return _callback(null) }
		sensors.forEach(function(item) {
			_sensorids.add(item.sensorid) 
		})
		return _callback(Array.from(_sensorids))     
	})
}

function getTemperature(sensorid,_callback){
        
	Temperature.find({},'-_id -__v',(error, temperatures) => {
		if (error) { return _callback(null) }
		return _callback(temperatures[temperatures.length-1])       
	}).where('sensorid').equals(sensorid)   
}

function getTemperatureInterval(sensorid,datefrom,dateto,_callback){
        
	Temperature.find({'tempdate': {'$gte': datefrom, '$lt': dateto}},'-_id -__v',(error, temperatures) => {
		if (error) { return _callback(null) }
		return _callback(temperatures)       
	}).where('sensorid').equals(sensorid) 
}


function getPulse(_callback){
    
	Alive.find((error, alivedata) => {
		if(alivedata.length == 0){
			return(_callback(false))
		}
		var currentLastDate = alivedata[alivedata.length-1].alivedate
		if(lastAliveDate != 0 && lastAliveDate != currentLastDate){
			lastAliveDate = currentLastDate
			return _callback(true)
		}else{
			lastAliveDate = currentLastDate
			return _callback(false)
		}        
	})
}

module.exports.getTemperatureSensors = getTemperatureSensors
module.exports.getTemperature = getTemperature
module.exports.getTemperatureInterval = getTemperatureInterval
module.exports.getPulse = getPulse