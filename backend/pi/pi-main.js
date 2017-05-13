'use strict';
// load the pi ap module
const PiApp = require('./pi-app');
const PiWatcher = require('./pi-watcher');

// load the Db module
const Db = require('./communication/db');
const db = new Db();

// load the gateway module
const Gateway = require('./devices/gateway');
const gateway = new Gateway();

// Create new Temperature Device
let TemperatureDevice;

//  Create new HeatSource Device
let HeatSourceDevice;
//  Create new PH Device
let PhDevice;
// Create new PumpDevice
let PumpDevice;

let socket = require('socket.io-client')('http://localhost:8081');

socket.on('connect', function () {
  console.log('Connected');
  socket.emit('new pi');
});
socket.on('disconnect', function () {
  console.log('Disconnected');
});


if (gateway.fingerPrint() === -1) // Mock for desktop testing
{
  TemperatureDevice = require('./mocks/mockTemperature.device');
  HeatSourceDevice = require('./mocks/mockHeatsource.device');
  PhDevice = require('./mocks/mockPh.device');
  PumpDevice = require('./mocks/mockPump.device');

  console.info('Device is not Raspberry! Using mock gateway instead');
}
else {
  TemperatureDevice = require('./devices/temperature.device');
  HeatSourceDevice = require('./devices/heatsource.device');
  PhDevice = require('./devices/ph.device');
  PumpDevice = require('./devices/pump.device')
}

const temperaturedevice = new TemperatureDevice;
const heatsourcedevice = new HeatSourceDevice();
const phdevice = new PhDevice();
const pumpdevice = new PumpDevice();

// Create new Sensor Values Context
const SensorValueContext = require('../models/sensor-value-context');
const sensorValueContext = new SensorValueContext();

// Create new Message Queue pi -> webservice
const MQueuePi = require('./communication/mqueue-pi');
const mQueuePi = new MQueuePi(sensorValueContext);

// create a new instance
// with the external dependencies
// db, devices, gateway
const piapp = new PiApp(db, temperaturedevice, heatsourcedevice, phdevice, pumpdevice, gateway, mQueuePi);

const piwatcher = new PiWatcher(mQueuePi, piapp, db);

piwatcher.startWatcher();

// Initialize the pi app
piapp.init();




