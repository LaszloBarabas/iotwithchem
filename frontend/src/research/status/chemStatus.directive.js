/**
 * Created by votiv on 12/01/2017.
 */
(() => {
	angular.module('kemia-app')
		.directive('chemStatus', chemStatus)

	chemStatus.$inject = []

	function chemStatus() {
		return {
			restrict: 'E',
			replace: 'true',
			templateUrl: 'frontend/src/research/status/chem-status.html',
			controller: 'statusController',
			controllerAs: 'sc'
		}
	}
})()