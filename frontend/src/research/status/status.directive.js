/**
 * Created by votiv on 12/01/2017.
 */
(() => {
	angular.module('kemia-app')
		.directive('status', status)

	status.$inject = []

	function status() {
		return {
			restrict: 'A',
			templateUrl: 'frontend/src/research/status/status.html',
			controller: 'statusController',
			controllerAs: 'sc'
		}
	}
})()