(() => {
	angular.module('kemia-app')
	.factory('phChartFactory', phChartFactory)

	phChartFactory.$inject = ['$http']

	function phChartFactory($http) {
		return {
			getPhInterval: getPhInterval
		}

		function getPhInterval(sensorid,datefrom,dateto) {
			return $http.get('/getPhinterval', {params: {sensorid:sensorid, datefrom: datefrom, dateto: dateto }})
        .then(getPhIntervalComplete).catch(getPhIntervalError)
		}

		function getPhIntervalComplete(response) {
			return response.data
		}

		function getPhIntervalError(error) {
			console.error('An error occured while getting the current Ph interval: ', error)
		}
	}
})()
