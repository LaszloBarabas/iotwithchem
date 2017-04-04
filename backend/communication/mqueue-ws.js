'use strict';


/**
 * Class to handle the communication
 * webservice  toward gateway
 * via messagequeue
 */
const MQueueWS = module.exports = function (io) {
  this.qR = 'qToRaspberry';
  this.qW = 'qToWebserver';
  this.channel = null;
  this.heatertemperature = 0;
  this.io = io;
  // somewhere else to put?
  this.init()
};

/**
 * initialize the communocation chanel and
 * set some initial parametes values
 */
MQueueWS.prototype.init = function () {

  this.cloudAmqpUrl = 'amqp://fiynopcz:fYBzRHfKTa-dcH8bgMo4WtTg5iPkpUa-@hare.rmq.cloudamqp.com/fiynopcz';
  const self = this;
  this.open = require('amqplib').connect(self.cloudAmqpUrl).then(function (conn) {
    let ok = conn.createChannel();
    ok.then(function (ch) {
      self.channel = ch;
      console.info("channel created");
      self.receivemsgfromRaspberry()
    });
  }).then(null, console.warn);
  this.io.on('connection', (socket) => {
    console.log('The user is connected');
    socket.on('disconnect', function () {
      console.log('The user is disconnected');
    });
  });

};


/**
 * Send message to teh Gateway (PI)
 */
MQueueWS.prototype.sendmsgtoRaspberry = function (msg) {
  // send meaasge
  this.channel.assertQueue(this.qR);
  this.channel.sendToQueue(this.qR, new Buffer(msg))
};

/**
 * Received message from teh  Gateway (PI)
 */
MQueueWS.prototype.receivemsgfromRaspberry = function () {
  this.channel.assertQueue(this.qW);
  this.channel.consume(this.qW, function (msg) {
    if (msg !== null) {
      this.MessageRouting(msg.content.toString());
      channel.ack(msg)
    }
  });
};


/**
 * Routing the income messages
 */
MQueueWS.prototype.MessageRouting = function (message) {
  const splitMessage = message.split(':');
  switch (splitMessage[0]) {
    case 'Heater':
      switch (splitMessage[1]) {
        case 'Temperature':
          this.heatertemperature = splitMessage[2];
          break;
        case 'ON':
          io.emit('heaterStatusChange', true);
          break;
        case 'OFF':
          io.emit('heaterStatusChange', false);
          break;
      }
      break;
    case 'Pump':
      switch (splitMessage[1]) {
        case 'ON':
          io.emit('pumpStatusChange', true);
          break;
        case 'OFF':
          io.emit('pumpStatusChange', false);
          break;
      }
  }
};


/**
 * Get the heater temperature
 */
MQueueWS.prototype.getHeaterTemperature = function (_callback) {
  return _callback(this.heatertemperature)
};
