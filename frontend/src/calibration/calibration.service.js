(() => {
	angular.module('kemia-app')
	.factory('calibrationFactory', calibrationFactory)

	calibrationFactory.$inject = ['$http']

	function calibrationFactory($http) {
		return {
			getPh: getPh ,
			calibratephsensorlow: calibratephsensorlow,
			calibratephsensormid: calibratephsensormid,
			calibratephsensorhigh: calibratephsensorhigh 	
		}

		function getPh() {
			return $http.get('/getph')
			.then(getPhComplete)
			.catch(getPhError)
		}
        
		function getPhComplete(response) {
			return response.data
		}
        
		function getPhError(error) {
			console.error('An error occured while getting the current ph: ', error)
		}
        
		function calibratephsensorlow(){
			return $http.get('/calibratephsensorlow')
            .then(calibratephsensorlowComplete)
            .catch(calibratephsensorlowError)
		}
        
		function calibratephsensorlowComplete(response) {
			return response.data
		}

		function calibratephsensorlowError(error) {
			console.error('An error occured while calibratephsensorlow', error)
		}

		function calibratephsensormid(){
			return $http.get('/calibratephsensormid')
			.then(calibratephsensormidComplete)
			.catch(calibratephsensormidError)
		}

		function calibratephsensormidComplete(response) {
			return response.data
		}

		function calibratephsensormidError(error) {
			console.error('An error occured while calibratephsensormid', error)
		}

		function calibratephsensorhigh(){
			return $http.get('/calibratephsensorhigh')
			.then(calibratephsensorhighComplete)
			.catch(calibratephsensorhighError)
		}

		function calibratephsensorhighComplete(response) {
			return response.data
		}

		function calibratephsensorhighError(error) {
			console.error('An error occured while calibratephsensorhigh', error)
		}
	}
})()
