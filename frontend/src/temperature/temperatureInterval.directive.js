(() => {
	angular.module('kemia-app')
		.directive('temperatureInterval', temperatureInterval)

	temperatureInterval.$inject = []

	function temperatureInterval() {
		return {
			restrict: 'A',
			templateUrl: 'frontend/src/temperature/temperature-interval.html',
			transclude: 'element',
			replace: true,
			scope: {

			},
			link: (scope, element, attributes) => {
				console.log(scope)
			}
		}
	}
})()