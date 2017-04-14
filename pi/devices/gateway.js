
var fs = require('fs')

/**
 * Class to  handle all the required gateway 
 * properties
 * Initialize the cpuinfo property   
 */
var Gateway = module.exports = function () {

    // Question : Why sync call ? Is it realy necessary ? 
	this.cpuinfo = !fs.existsSync('/proc/cpuinfo') ? '' : fs.readFileSync('/proc/cpuinfo') + ''
	this.cpuJson = this.init()

} 


/**
 *    Split the  the property 
 * 
 */
Gateway.prototype.init = function() {
	var self = this 
	return self.cpuinfo.split('\n').reduce(function (result, line) {
		line = line.replace(/\t/g, '')
		var parts = line.split(':')
		var key = parts[0].replace(/\s/g, '_')
		if (parts.length === 2) {
			result[key] = parts[1].trim().split(' ')
		}
		return result
	}, {})

}

/**
 * 
 * Make it more readable for the pblic world 
 * 
 */
Gateway.prototype.fingerPrint = function () {

	var self = this

	return  self.serialNumber = self.cpuJson['Serial'] == undefined ? -1 : self.cpuJson['Serial'][0]
	
}



