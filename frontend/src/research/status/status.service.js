(() => {
	angular.module('kemia-app')
	.factory('statusFactory', statusFactory)

	statusFactory.$inject = ['$http']

	function statusFactory($http) {
		return {
			getStatus: getStatus
		}

		function getStatus() {
			return $http.get('/isalive')
			.then(getStatusComplete)
			.catch(getStatusError)
		}

		function getStatusComplete(response) {
			console.error(response.data)
			return response.data
		}

		function getStatusError(error) {
			console.error('An error occured while getting the pi status: ', error)
		}
	}
})()
