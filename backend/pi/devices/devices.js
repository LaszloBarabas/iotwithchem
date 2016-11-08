var ds18b20 = require('./ds18b20');

function temperatureDevice(_callback)
{
	ds18b20.sensors(function(err, ids) {

			if(err){
				return _callback(err,ids);
			}
		    ds18b20.temperature(ids, {parser: 'hex'}, function(err, value) {
		      return _callback(err,value);
		    });
	        
	  });
}

module.exports.temperatureDevice = temperatureDevice;
