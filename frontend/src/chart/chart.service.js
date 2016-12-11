(() => {
	angular.module('kemia-app')
		.factory('chartFactory', chartFactory)

	chartFactory.$inject = ['$http']

	function chartFactory($http) {
		return {
			getTemperatureInterval: getTemperatureInterval
		}

		function getTemperatureInterval(sensorId, dateFrom, dateTo) {
			return $http.get('/gettemperatureinterval', {
				params: {
					sensorid: sensorId,
					datefrom: dateFrom,
					dateto: dateTo
				}
			})
				.then(getTemperatureIntervalComplete)
				.catch(getTemperatureIntervalError)
		}

		function getTemperatureIntervalComplete(response) {
			console.log('chart factory', 	response)
			return response.data
		}

		function getTemperatureIntervalError(error) {
			console.error('An error occured while getting the current temperature interval: ', error)
		}
	}
})()
