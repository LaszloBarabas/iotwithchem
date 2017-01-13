/**
 * Created by votiv on 13/01/2017.
 */
(() => {
	angular.module('kemia-app')
		.directive('piSensor', piSensor)

	piSensor.$inject = []

	function piSensor() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'frontend/src/research/pi-sensor/pi-sensor.html',
			scope: {
				name: '@',
				lastDate: '=',
				lastValue: '='
			},
			link: (scope, element, attributes) => {
				console.log('yolo swag')
			}
		}
	}
})()