var PiWatcher = module.exports = function (messagequeue, piapp) {
	this.messagequeue	= messagequeue
	this.piapp			= piapp

	this.started = false;
	this.watcherInterval = 3000;
}

PiWatcher.prototype.startWork = function () {
	console.info("WORK STARTED!")
	console.info('Work duration = ', this.workDuration)
	this.started = true
	this.elpassedTime = 0
	this.piapp.init()
	this.piapp.setEventLoop()
}

PiWatcher.prototype.stopWork = function () {
	clearTimeout(this.workStopTimeout)
	console.info("WORK STOPPED!")
	this.started = false
	this.messagequeue.sensorValueContext.setWorkInProgress(false)
	this.piapp.unsetEventLoop()
	var self = this
	setTimeout(function(){clearInterval(self.debugCountdownTimeout)},500)
}

PiWatcher.prototype.debugCounter = function() {
	this.elpassedTime = this.elpassedTime + 1;
	var remainingSeconds = this.workDuration - this.elpassedTime
	var remainingMinutes = Math.floor(remainingSeconds / 60) % 60
	var remainingHours = Math.floor(remainingSeconds / 3600)
	remainingSeconds = remainingSeconds % 60
	console.info('-------------------------------------------------------------------')
	// console.info('Time remaining on job - ', this.workDuration - this.elpassedTime , ' seconds')
	console.info('Time Remaining on job - ' + remainingHours + ':' + remainingMinutes + ':' + remainingSeconds )
	console.info('Work done by ', this.elpassedTime * 100 /this.workDuration , '% ')
	console.warn('-------------------------------------------------------------------')
}


PiWatcher.prototype.workInProgressWatcher = function () {
	var workinprogress = this.messagequeue.sensorValueContext.isWorkInProgress()

	if(workinprogress && !this.started){
		this.startWork()
		this.workDuration = this.messagequeue.sensorValueContext.getWorkDuration()
		this.debugCountdownTimeout = setInterval(this.debugCounter.bind(this), 1000)
		this.workStopTimeout = setTimeout(this.stopWork.bind(this),this.workDuration * 1000 ) // Stop after timeout
	}
	else if(!workinprogress && this.started){
		this.stopWork()
	}

}

PiWatcher.prototype.startWatcher = function () {
	console.log("Waiting for a job...")
	setInterval(this.workInProgressWatcher.bind(this),this.watcherInterval)
}