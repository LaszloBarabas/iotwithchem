(() => {
	angular.module('kemia-app')
	.factory('phFactory', phFactory)

	phFactory.$inject = ['$http']

	function phFactory($http) {
		return {
			getPh: getPh ,
			setHeaterPh:setHeaterPh
		}

		function getPh() {
			return $http.get('/getph')
			.then(getPhComplete)
			.catch(getPhError)
		}

		function setHeaterPh(phvalue){
			console.log($http.get('/setphvalue', {params: {phvalue:phvalue}}))
			return $http.get('/setphvalue', {params: {phvalue:phvalue}})
			.then(setHeaterPhComplete)
			.catch(setHeaterPhError)
		}

		function getPhComplete(response) {
			return response.data
		}
		function setHeaterPhComplete(response) {
			return response.data
		}

		function setHeaterPhError(error) {
			console.error('An error occured while setting the  ph value: ', error)
		}
		function getPhError(error) {
			console.error('An error occured while getting the current ph: ', error)
		}

	}
})()
