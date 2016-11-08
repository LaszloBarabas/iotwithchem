var devices = require('./devices/devices');
var cpuinfo = require('./devices/cpuinfo')();
var serialNumber = cpuinfo['Serial'] == undefined ? -1 : cpuinfo['Serial'][0];

//Prints temperature to console
function temperatureToConsole(){
	devices.temperatureDevice(function(err,value){
			console.log('Raspberry -',serialNumber);
			console.log('Current temperature on sensor is', value);
		});
}

tempIntervalID = setInterval(temperatureToConsole,1000);
