(() => {
	angular.module('kemia-app')
		.factory('temperatureFactory', temperatureFactory)

	temperatureFactory.$inject = ['$http']

	function temperatureFactory($http) {
		return {
			getLastMeasuredTemperature: getLastMeasuredTemperature,
			getTemperatureInterval: getTemperatureInterval,
			setTemperatureTime: setTemperatureTime
			// setHeaterTemperature: setHeaterTemperature
		}

		/**
		 * Get current temperature value
		 * @returns {*|Promise|Promise.<T>}
		 */
		function getLastMeasuredTemperature() {
			return $http.get('/gettemperature')
				.then(handleSuccess)
				.catch(handleError)
		}

		/**
		 * Get all temperature values in the given interval
		 * @param sensorId - which gateway to use
		 * @param dateFrom - start date of interval
		 * @param dateTo - end date of interval (usually 'now')
		 * @returns {*}
		 */
		function getTemperatureInterval(sensorId, dateFrom, dateTo) {
			return $http.get('/gettemperatureinterval', {
				params: {
					sensorid: sensorId,
					datefrom: dateFrom,
					dateto: dateTo
				}
			})
				.then(handleSuccess)
				.catch(handleError)
		}

		/**
		 * Set the interval of time from which temperature values should be retrieved
		 * @param sensorId - which gateway to use
		 * @param interval - time interval
		 * @returns {*}
		 */
		function setTemperatureTime(sensorId, interval) {
			return $http.get('/settemperaturesensorsuploadintervall', {
				params: {
					sensorid: sensorId,
					upinterval: interval
				}
			})
				.then(handleSuccess)
				.catch(handleError)
		}


		function handleSuccess(response) {
			return response.data
		}

		function handleError(error) {
			console.error(error)
		}


		/*function getTemperature() {
		 return $http.get('/gettemperature')
		 .then(getTemperatureComplete)
		 .catch(getTemperatureError)
		 }

		 function setTemperatureTime(sensorid, time) {
		 return $http.get('/settemperaturesensorsuploadintervall', {params: {upinterval: time, sensorid: sensorid}})
		 .then(setTemperatureTimeComplete)
		 .catch(setTemperatureTimeComplateError)
		 }

		 function setHeaterTemperature(heatertemp) {
		 console.log($http.get('/setheatertemperature', {params: {heatertemp: heatertemp}}))
		 return $http.get('/setheatertemperature', {params: {heatertemp: heatertemp}})
		 .then(setHeaterTemperatureComplete)
		 .catch(setHeaterTemperatureError)
		 }

		 function setTemperatureTimeComplete(response) {
		 return response.data
		 }

		 function getTemperatureComplete(response) {
		 return response.data
		 }

		 function setHeaterTemperatureComplete(response) {
		 return response.data
		 }

		 function setHeaterTemperatureError(error) {
		 console.error('An error occured while setting the  temperature value: ', error)
		 }

		 function getTemperatureError(error) {
		 console.error('An error occured while getting the current temperature: ', error)
		 }

		 function setTemperatureTimeComplateError(error) {
		 console.error('An error occured while setting the temperature interval: ', error)
		 }*/
	}
})()
