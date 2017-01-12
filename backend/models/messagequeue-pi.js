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
    heatertemperature = 0,
    uploadTempInterval = 30000,
    calibrate = 'N', //no calibration
    pumpIsWorking = false,
    phValue = 7.0

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
    case 'Sensor':
        switch(splitMessage[1]){
		    case 'UpInterval':
                uploadTempInterval = splitMessage[3]
			    break
		    }
        break 
    case 'Ph':
        switch(splitMessage[1]){
		    case 'Calibrate':
                switch(splitMessage[2]){
        		    case 'Low':
                        calibrate = 'L'
        			    break
                    case 'Mid':
                        calibrate = 'M'
                        break
                    case 'High':
                        calibrate = 'H'
                        break
		        }
			    break
            case 'Value':
                phValue = splitMessage[2]
                break
		    }
        break
    case 'Pump':
        switch(splitMessage[2]){ // [1] is calibrate or other function... might need to set that too
            case 'ON':
                pumpIsWorking = true;
                break
            case 'OFF':
                pumpIsWorking = false;
                break
        }
    break   
	}
}

function getHeaterTemperature()
{
    return heatertemperature
}

function getUploadInterval(){
    return uploadTempInterval
}

function isPumpWorking(){
    return pumpIsWorking
}

function setPumpWorking(value){
    pumpIsWorking = value
}

function getCalibration(){
    return calibrate
}

function resetCalibration(){
     calibrate = 'N'
}

function getPhValue(){
    return phValue;
}

module.exports.sendmsgtoWebserver = sendmsgtoWebserver
module.exports.getHeaterTemperature = getHeaterTemperature
module.exports.getUploadInterval = getUploadInterval
module.exports.getCalibration = getCalibration
module.exports.resetCalibration = resetCalibration
module.exports.isPumpWorking = isPumpWorking
module.exports.setPumpWorking = setPumpWorking
module.exports.getPhValue = getPhValue