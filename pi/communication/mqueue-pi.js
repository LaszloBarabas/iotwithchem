'use strict'

/**
 * Class to handle the communication 
 * pi gateway toward webservice 
 * via messagequeue 
 */

var MQueuePI = module.exports = function (sensorValueContext ) {
	this.qR = 'qToRaspberry'
	this.qW = 'qToWebserver'
	this.channel = null
	this.sensorValueContext = sensorValueContext


	// somewhere else to put? 
	this.init()
}

/**
 * initialize the communocation chanel and 
 * set some initial parametes values 
 */
// MQueuePI.prototype.init = function () {
MQueuePI.prototype.init = function () {

	
	this.cloudAmqpUrl = 'amqp://fiynopcz:fYBzRHfKTa-dcH8bgMo4WtTg5iPkpUa-@hare.rmq.cloudamqp.com/fiynopcz'
	var self = this
	this.open = require('amqplib').connect(self.cloudAmqpUrl).then(function (conn) {
		var ok = conn.createChannel();
		ok = ok.then(function (ch) {
			self.channel = ch
			console.info("channel created")
			self.receivemsgfromWebserver()
		});
	}).then(null, console.warn)


	
}


/** 
 * Send message to Webserver 
 */
MQueuePI.prototype.sendmsgtoWebserver = function (msg) {
	this.channel.assertQueue(this.qW)
	this.channel.sendToQueue(this.qW, new Buffer(msg))
}

/** 
 * Receceive messages from teh Webserver 
 */
MQueuePI.prototype.receivemsgfromWebserver = function () {
	this.channel.assertQueue(this.qR)
	var self = this
	this.channel.consume(this.qR, function (msg) {
		if (msg !== null) {
			console.info('New message from WEB', msg.content.toString())
			self.MessageRouting(msg.content.toString())
			self.channel.ack(msg)
		}
	});
}

/**
 * Routing the income messages 
 */
MQueuePI.prototype.MessageRouting = function (message) {
	var splitMessage = message.split(':')

	switch (splitMessage[0]) {
	case 'Heater':
		switch (splitMessage[1]) {
		case 'Temperature':
			this.sensorValueContext.setHeaterTemperature(splitMessage[2]) 
			break
		}
		break
	case 'Sensor':
		switch (splitMessage[1]) {
		case 'UpInterval':
			this.sensorValueContext.setUploadInterval (splitMessage[3] ) 
			break
		}
		break
	case 'Ph':
		switch (splitMessage[1]) {
		case 'Calibrate':
			// handled all the cases Low, Mid, High based on the first character of the splitMessage[2]  
			this.sensorValueContext.setCalibration( splitMessage[2].charAt(0)  ) 
			break  
		case 'Value':
			this.sensorValueContext.setPhValue(splitMessage[2]) 
			break
		}
		break
	case 'Pump':      
		switch (splitMessage[1]) { 
		case 'ON':
			this.sensorValueContext.setPumpIsWorking(true)
			break
		case 'OFF':
			this.sensorValueContext.setPumpIsWorking(false) 
			break
		}
		break
	}

}