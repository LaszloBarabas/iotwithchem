
// load the pi ap module 
var PiApp = require('./pi-app')
var PiWatcher = require('./pi-watcher')

// load the Db module 
var Db = require('./communication/db')
var db = new Db(); 

// load the gateway module
var Gateway = require('./devices/gateway')
var gateway = new Gateway()

// Create new Temperature Device 
var TemperatureDevice

//  Create new HeatSource Device 
var HeatSourceDevice;
//  Create new PH Device 
var PhDevice;
// Create new PumpDevice
var PumpDevice;


if(gateway.fingerPrint() == -1) // Mock for desktop testing
{
	TemperatureDevice = require('./mocks/mockTemperature.device') 
	HeatSourceDevice = require ('./mocks/mockHeatsource.device')
	PhDevice =  require ('./mocks/mockPh.device')
	PumpDevice = require('./mocks/mockPump.device')
	
	console.info('Device is not Raspberry! Using mock gateway instead');
}
else
{
	TemperatureDevice = require('./devices/temperature.device') 
	HeatSourceDevice =  require ('./devices/heatsource.device')
	PhDevice =  require ('./devices/ph.device')
	PumpDevice = require('./devices/pump.device')
}

var temperaturedevice = new TemperatureDevice 
var heatsourcedevice = new HeatSourceDevice();
var phdevice = new PhDevice()   
var pumpdevice = new PumpDevice()

// Create new Sensor Values Context 
var SensorValueContext = require ('../backend/models/sensor-value-context')
var sensorValueContext = new SensorValueContext () 

// Create new Message Queue pi -> webservice 
var MQueuePi = require ('./communication/mqueue-pi')
var mQueuePi = new MQueuePi (sensorValueContext)  

// create a new instance 
// with the exernal dependencies 
// db, devices, gateway 
var piapp = new PiApp(db, temperaturedevice, heatsourcedevice, phdevice, pumpdevice, gateway, mQueuePi)

var piwatcher = new PiWatcher(mQueuePi,piapp)


piwatcher.startWatcher()



// Initialize the pi app 
// piapp.init()
// start the event loop of the pi app 
// piapp.setEventLoop()


