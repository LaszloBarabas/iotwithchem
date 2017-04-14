'use strict'



/**
 * Class to handle the communication 
 * webservice  toward gateway 
 * via messagequeue 
 */



var MQueueWS = module.exports = function () {
	this.qR = 'qToRaspberry'
	this.qW = 'qToWebserver'
	this.channel = null
	this.heatertemperature = 0
	// somewhere else to put? 
	this.init()
}

/**
 * initialize the communocation chanel and 
 * set some initial parametes values 
 */
MQueueWS.prototype.init = function () {

	this.cloudAmqpUrl = 'amqp://fiynopcz:fYBzRHfKTa-dcH8bgMo4WtTg5iPkpUa-@hare.rmq.cloudamqp.com/fiynopcz'
	var self = this
	this.open = require('amqplib').connect(self.cloudAmqpUrl).then(function (conn) {
		var ok = conn.createChannel();
		ok = ok.then(function (ch) {
			self.channel = ch
			console.info("channel created")
			self.receivemsgfromRaspberry()
		});
	}).then(null, console.warn)

}



/** 
 * Send message to teh Gateway (PI) 
 */
MQueueWS.prototype.sendmsgtoRaspberry = function (msg) {
	// send meaasge
	this.channel.assertQueue(this.qR)
	this.channel.sendToQueue(this.qR, new Buffer(msg))
}

/** 
 * Received message from teh  Gateway (PI) 
 */
MQueueWS.prototype.receivemsgfromRaspberry = function () {
	this.channel.assertQueue(this.qW)
	var self = this;
	this.channel.consume(this.qW, function (msg) {
		if (msg !== null) {
			self.MessageRouting(msg.content.toString());
			self.channel.ack(msg)
		}
	});
}


/**
 * Routing the income messages 
 */
MQueueWS.prototype.MessageRouting = function (message) {
	var splitMessage = message.split(':')
	switch (splitMessage[0]) {
		case 'Heater':
			switch (splitMessage[1]) {
				case 'Temperature':

					this.heatertemperature = splitMessage[2]
					break
			}
			break
	}
}



/**
 * Get the heater temperature 
 */
MQueueWS.prototype.MessageRouting.getHeaterTemperature = function (_callback)
{
    return _callback(this.heatertemperature)
}