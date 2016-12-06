'use strict'

let qR = 'qToRaspberry',
    qW = 'qToWebserver',
    channel = null,
    cloudAmqpUrl = "amqp://pwxpzbkg:2lBrsgZEGj8gtGAg9ezbGzpOba8l-3Mo@squirrel.rmq.cloudamqp.com/pwxpzbkg",
    open = require('amqplib').connect(cloudAmqpUrl).then(function(conn) {
        var ok = conn.createChannel();
        ok = ok.then(function(ch) {
            channel = ch
            console.info("channel created")
            receivemsgfromRaspberry()
        });
    }).then(null, console.warn),
    heatertemperature = 0


function sendmsgtoRaspberry(msg){
    // send meaasge
    channel.assertQueue(qR)
    channel.sendToQueue(qR, new Buffer(msg))
}

function receivemsgfromRaspberry(){
    channel.assertQueue(qW)
    channel.consume(qW, function(msg) {
                if (msg !== null) {
                    MessageRouting(msg.content.toString());             
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

function getHeaterTemperature(_callback)
{
    return _callback(heatertemperature)
}

module.exports.sendmsgtoRaspberry = sendmsgtoRaspberry
module.exports.getHeaterTemperature = getHeaterTemperature