var i2c = require('i2c-bus'),
    i2c1 = i2c.openSync(1)

/**
 * Class to handle all the required devices, sensors
 */
var PhDevice = module.exports = function () {
    this.init()
}

PhDevice.prototype.init = function () {
    this.PH_STD_ADDR = 0x63
    this.READ_LENGTH = 7
    this.PH_CMD_READ = 0x52
}

/*
 * @returns the phvalue
 */
PhDevice.prototype.getPh = function (callback) {
var self = this
    i2c1.sendByte(self.PH_STD_ADDR, self.PH_CMD_READ,function(err){
        if (err) {
            console.info('--------!!!!!-----',err)
            return callback(0) 
            }
        setTimeout(function () {
            var PH_OUTPUT = new Buffer(self.READ_LENGTH)
            i2c1.i2cReadSync(self.PH_STD_ADDR, self.READ_LENGTH, PH_OUTPUT)
            var phstr
            return callback(parseFloat(PH_OUTPUT.toString().substr(1)).toString())
        }.bind(self), 1000);   
    })   
}

/*
 * @return if calibration was Successful or not
 */
PhDevice.prototype.calibrateHigh = function (value,callback) {
    var self = this
    var PH_CALIBRATION_SEND = new Buffer('CAL,HIGH,' + value);
    i2c1.i2cWrite(self.PH_STD_ADDR, 14, PH_CALIBRATION_SEND,function(err){
        if (err) return callback(err)
        setTimeout(function () {
            var PH_OUTPUT = new Buffer(1);
            i2c1.i2cReadSync(self.PH_STD_ADDR, 1, PH_OUTPUT)
            if (PH_OUTPUT[0] == 1) {
                return callback('Successed - cal,high')
            } else {
                return callback('Failed - cal,high')
            }
        }.bind(this), 1600);
    })
}

/*
 * @return if calibration was Successful or not
 */
PhDevice.prototype.calibrateMiddle = function (value,callback) {
    var self = this
    var PH_CALIBRATION_SEND = new Buffer('CAL,MID,' + value);
    i2c1.i2cWrite(self.PH_STD_ADDR, 12, PH_CALIBRATION_SEND,function(err){
        if (err) return callback(err)
        setTimeout(function () {
            var PH_OUTPUT = new Buffer(1);
            i2c1.i2cReadSync(self.PH_STD_ADDR, 1, PH_OUTPUT)
            if (PH_OUTPUT[0] == 1) {
                return callback('Successed - cal,mid')
            } else {
                return callback('Failed - cal,mid')
            }
        }.bind(this), 1600);
    })
}

/*
 * @return if calibration was Successful or not
 */
PhDevice.prototype.calibrateLow = function (value,callback) {
    var self = this
    var PH_CALIBRATION_SEND = new Buffer('CAL,LOW,' + value);
    i2c1.i2cWrite(self.PH_STD_ADDR, 12, PH_CALIBRATION_SEND,function(err){
        if (err) return callback(err)
        setTimeout(function () {
            var PH_OUTPUT = new Buffer(1);
            i2c1.i2cReadSync(self.PH_STD_ADDR, 1, PH_OUTPUT)
            if (PH_OUTPUT[0] == 1) {
                return callback('Successed - cal,low')
            } else {
                return callback('Failed - cal,low')
            }
        }.bind(this), 1600);
    })
}
