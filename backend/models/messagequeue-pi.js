'use strict'

let qR = 'qToRaspberry',
    qW = 'qToWebserver',
    channel = null,
    cloudAmqpUrl = "amqp://fiynopcz:fYBzRHfKTa-dcH8bgMo4WtTg5iPkpUa-@hare.rmq.cloudamqp.com/fiynopcz",
    open = require('amqplib').connect(cloudAmqpUrl).then(function(conn) {
        var ok = conn.createChannel();
        ok = ok.then(function(ch) {
            channel = ch
            console.info("channel created")
            receivemsgfromWebserver()
        });
    }).then(null, console.warn),
    heatertemperature = 0

function sendmsgtoWebserver(msg){
    channel.assertQueue(qW)
    channel.sendToQueue(qW,new Buffer(msg))
}

function receivemsgfromWebserver(){
    channel.assertQueue(qR)
    channel.consume(qR, function(msg) {
                if (msg !== null) {
                    console.info('New message from WEB',msg.content.toString())
                    MessageRouting(msg.content.toString())
                    channel.ack(msg)
                }
          });
}

function MessageRouting(message){
	var splitMessage = message.split(':')
	switch(splitMessage[0]){
	case 'Heater':
		switch(splitMessage[1]){
		case 'Temperature':
			heatertemperature = splitMessage[2] 
			break
		}
		break
	}
}

function getHeaterTemperature()
{
    return heatertemperature
}

module.exports.sendmsgtoWebserver = sendmsgtoWebserver
module.exports.getHeaterTemperature = getHeaterTemperature