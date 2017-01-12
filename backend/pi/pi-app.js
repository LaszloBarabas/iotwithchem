/* 
**  Create an initial   app class
** with the injected external dependencies  
** 
*/ 
var PiApp = module.exports =  function (db, temperaturedevice, heatsourcedevice, phdevice, pumpdevice, gateway, messagequeue) {
	this.db                          = db
	this.temperaturedevice           = temperaturedevice  
	this.heatsourcedevice            = heatsourcedevice 
	this.phdevice					 = phdevice
	this.pumpdevice                  = pumpdevice
	this.gateway 		             = gateway
	this.messagequeue                = messagequeue
} 

/**
 *   Init functions 
 * 
 */
PiApp.prototype.init = function () { 
	this.serialnumber   = this.gateway.fingerPrint()
	this.hearthBeatInterval = 3000 
	this.temperatureUploadInterval = 30000
	this.phUploadInterval = 30000 
	this.heatingCheckInterval = 2000
	this.phCheckInterval = 2000
	this.messagequeueCheckInterval = 3000
	this.ph = 0
} 


/** 
 * Uploads data to database 
 */
PiApp.prototype.uploadDataToDatabase = function () {
	var self = this 
	this.temperaturedevice.actualValue(function(err,value){
		console.info('Raspberry -', self.serialnumber)
		console.info('Current temperature on sensor is', value)
		self.db.createTemperatureMessage(self.serialnumber,'1',value,new Date().getTime(),function(err){
			if (err) console.error(err)            
		})
	})
	
	if (this.ph != 0){
		console.info('Raspberry -', self.serialnumber)
		console.info('-----Current ph on sensor is: ' + self.ph)
		self.db.createPhMessage(self.serialnumber,'1',this.ph,new Date().getTime(),function(err){
			if (err) console.error(err)            
		})
	}
	else 
	{
		console.info('-----Phsensor is not connected !!!')
	}
	this.uploadDataTimeout = setTimeout(this.uploadDataToDatabase.bind(this),this.temperatureUploadInterval)
}

/** 
 * Uploads alive data to database
 */

PiApp.prototype.IsAlive = function () {
	var self = this 
	var currentDate = new Date().getTime()
	this.db.createAliveMessage(self.serialnumber, currentDate,function(err){
		if (err) console.error(err)            
	})
	console.info('Alive -',currentDate)
}
 
/** 
 * Keeps the temperature betweet tolerance values
 */
PiApp.prototype.heatingCheck = function(){
	var self = this 
	this.temperaturedevice.actualValue(function(err,value){
		console.log('Current temperature',value)
		if( value < self.heatsourcedevice.lowerHeatTolerance){
			self.heatsourcedevice.turnOnHeatRelay()
		}
		else if( value> self.heatsourcedevice.upperHeatTolerance){
			self.heatsourcedevice.turnOffHeatRelay()
		}
	})
}

/** 
 * Keeps the ph betweet tolerance values
 */
PiApp.prototype.phCheck = function(){
	var self = this 
	this.phdevice.getPh(function(phvalue){
		console.log('Atlas-scientific-PhMeter READ Value: ' + phvalue)
		self.ph = phvalue
		if( phvalue < (self.pumpdevice.pumpPhValue - self.pumpdevice.pumpDelta) ||
			phvalue > (self.pumpdevice.pumpPhValue + self.pumpdevice.pumpDelta)){
			self.pumpdevice.turnOnPump()
		}else{
			self.pumpdevice.turnOffPump()
		}
	})
	this.phcheckTimeout = setTimeout(this.phCheck.bind(this),this.phCheckInterval)
}

/**
 * Calibrate Low Ph sensor (ph = 4.00 ) 
 */
PiApp.prototype.phCallibrateLow = function(){
	var self = this 
	clearTimeout(self.phcheckTimeout)
	var ph = '4.00'
	this.phdevice.calibrateLow(ph,function(calbackmsg){
		console.log('Calibration Low on PhSensor was ' + calbackmsg)
		self.phcheckTimeout = setTimeout(self.phCheck.bind(self),self.phCheckInterval)
	})
}

/**
 * Calibrate Middle Ph sensor (ph = 7.00 ) 
 */
PiApp.prototype.phCallibrateMid = function(){
	var self = this 
	clearTimeout(self.phcheckTimeout)
	var ph = '7.00'
	this.phdevice.calibrateMiddle(ph,function(calbackmsg){
		console.log('Calibration Mid on PhSensor was ' + calbackmsg)
		self.phcheckTimeout = setTimeout(self.phCheck.bind(self),self.phCheckInterval)
	})
}

/**
 * Calibrate High Ph sensor (ph = 10.00 ) 
 */
PiApp.prototype.phCallibrateHigh = function(){
	var self = this 
	clearTimeout(self.phcheckTimeout)
	var ph = '10.00'
	this.phdevice.calibrateHigh(ph,function(calbackmsg){
		console.log('Calibration High on PhSensor was ' + calbackmsg)
		self.phcheckTimeout = setTimeout(self.phCheck.bind(self),self.phCheckInterval)
	})
}

/**
 * Checks if the heating value has changed in messagequeue
 * and sends a message if it changed here to.
 * Checks if uploadInterval was changed and updates that too
 */
PiApp.prototype.messagequeueCheck = function(){
	var lastTempInQueue = parseInt(this.messagequeue.getHeaterTemperature())
	var currentHeatingValue = this.heatsourcedevice.heatingValue
	console.info('LastTempInQueue',lastTempInQueue)
	console.info('CurrentHeatValue',currentHeatingValue)
	if (lastTempInQueue != currentHeatingValue){
		this.heatsourcedevice.setHeatingTo(lastTempInQueue)
		this.messagequeue.sendmsgtoWebserver('Heater:Temperature:'+lastTempInQueue)
	}
	var lastUploadIntervalinQueue = parseInt(this.messagequeue.getUploadInterval())
	if(lastUploadIntervalinQueue != this.temperatureUploadInterval){
		this.temperatureUploadInterval = lastUploadIntervalinQueue
		clearTimeout(this.uploadDataTimeout)
		this.uploadDataTimeout = setTimeout(this.uploadDataToDatabase.bind(this),this.temperatureUploadInterval)
	}

	var phValue = parseFloat(this.messagequeue.getPhValue())
	if( phValue != this.pumpdevice.pumpPhValue ){
		this.pumpdevice.setPumpPh(phValue)
	}
	
	var calibrate = this.messagequeue.getCalibration()
	switch(calibrate){
		case 'L':
        		this.phCallibrateLow()
			this.messagequeue.resetCalibration()
			break
        	case 'M':
            		this.phCallibrateMid()
			this.messagequeue.resetCalibration()
            		break
        	case 'H':
            		this.phCallibrateHigh()
			this.messagequeue.resetCalibration()
            break
		}
}

/**
 *  Set the main event loop  
 * 
 *  */ 
PiApp.prototype.setEventLoop = function () {

	setInterval(this.IsAlive.bind(this),this.hearthBeatInterval)
	this.uploadDataTimeout = setTimeout(this.uploadDataToDatabase.bind(this),this.temperatureUploadInterval)
	setInterval(this.heatingCheck.bind(this),this.heatingCheckInterval)
	this.phcheckTimeout = setTimeout(this.phCheck.bind(this),this.phCheckInterval)
	setInterval(this.messagequeueCheck.bind(this),this.messagequeueCheckInterval)

}
