'use strict'

let path = require('path'),
	db = require(path.resolve('backend/models/downloadData.js')),
	mq = require(path.resolve('backend/models/messagequeue.js'))

var raspiAlive = false
var time=0

module.exports = (app, passport) => {

	app.get('/getsensorids', (req, res) => {
		db.getTemperatureSensors(function(returndata){
			res.json(returndata)
		})
	})


	app.get('/gettemperature', (req, res) => {
		var sensorid = req.param('sensorid')
		if (typeof sensorid === 'undefined') sensorid = '1'

		db.getTemperature(sensorid,function(returndata){
			res.json(returndata)
		})
	})


	app.get('/gettemperatureinterval', (req, res) => {
		var sensorid = req.param('sensorid')
		var datefrom = req.param('datefrom')
		var dateto = req.param('dateto')
		if (typeof sensorid === 'undefined') sensorid = '1'

		db.getTemperatureInterval(sensorid,datefrom,dateto,function(returndata){
			res.json(returndata)
		})

	})

	app.get('/getph', (req, res) => {
		var sensorid = req.param('sensorid')
		if (typeof sensorid === 'undefined') sensorid = '1'

		db.getPh(sensorid,function(returndata){
			res.json(returndata)
		})
	})


	app.get('/getphinterval', (req, res) => {
		var sensorid = req.param('sensorid')
		var datefrom = req.param('datefrom')
		var dateto = req.param('dateto')
		if (typeof sensorid === 'undefined') sensorid = '1'

		db.getPhInterval(sensorid,datefrom,dateto,function(returndata){
			res.json(returndata)
		})
	})


	app.get('/isalive', (req, res) => {
		res.json({alive : raspiAlive})
	})

	app.get('/login/facebook',
	passport.authenticate('facebook', { scope: [ 'email' ]}))

	app.get('/login/facebook/return',
	passport.authenticate('facebook', { failureRedirect: '/research', scope : ['email'] }),
	(req, res) => {
		res.redirect('/research')
	})


	app.get('/logout', (req, res) => {
		req.logout()
		res.redirect('/home')
	})

	app.get('/checkAuth', (req, res) => {

		//console.log(req.user);
		if (req.isAuthenticated()) {
			res.json({'status' : 'authenticated', 'user' : req.user.fb})
		} else {
			res.json({'status' : 'unauthenticated'})
		}
	})

	app.get('/setheateron', function (req, res) {
		mq.sendmsgtoRaspberry('Heater:ON')
    	res.json({ heater: true });
	})

	app.get('/setheateroff', function (req, res) {
		mq.sendmsgtoRaspberry('Heater:OFF')
    	res.json({ heater: false })
	})

	app.get('/setheatertemperature', function (req, res) {
		var heatertemp = req.param('heatertemp')
    	mq.sendmsgtoRaspberry('Heater:Temperature:'+heatertemp)
    	mq.getHeaterTemperature(function(returndata)
		{
			res.json({heatertemperature: returndata})
		})
	})

	app.get('/getheatertemperature', function (req, res) {
    	mq.getHeaterTemperature(function(returndata)
		{
			res.json({heatertemperature: returndata})
		})
	})

	app.get('/settemperaturesensorsuploadintervall', function (req, res) {
		var upinterval = req.param('upinterval')
		var sensorid = req.param('sensorid')
		if (typeof sensorid === 'undefined') sensorid = '1'
		if (typeof upinterval === 'undefined') upinterval = '30000'
    	mq.sendmsgtoRaspberry('Sensor:UpInterval:'+sensorid+':'+upinterval)
    	res.json({sent: true})
	})
    
    app.get('/setpumpon', function (req, res) {
    	time=new Date()
    	mq.sendmsgtoRaspberry('Pump:Calibrate:ON')
    	res.json({sent: true})
	})
	app.get('/setpumpoff', function (req, res) {
		time=new Date()-time
    	mq.sendmsgtoRaspberry('Pump:Calibrate:OFF')
    	res.json({time: time})
	})

	app.get('/calibratephsensorlow', function (req, res) {
    	mq.sendmsgtoRaspberry('Ph:Calibrate:Low')
		res.json({sent : true})
	})

	app.get('/calibratephsensormid', function (req, res) {
    	mq.sendmsgtoRaspberry('Ph:Calibrate:Mid')
		res.json({sent : true})
	})

	app.get('/calibratephsensorhigh', function (req, res) {
    	mq.sendmsgtoRaspberry('Ph:Calibrate:High')
		res.json({sent : true})
	})

	app.get('/setphvalue', function (req, res) {
		var phvalue = req.param('phvalue')
    	mq.sendmsgtoRaspberry('Ph:Value:'+phvalue)
		res.json({sent : true})
	})

	app.get('*', (req, res) => {
		res.sendFile(path.resolve('./frontend/index.html'))
	})


}

setInterval(() => {
	db.getPulse((returndata) => {
		raspiAlive = returndata
	}
)},3000)
