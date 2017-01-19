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
				lastValue: '=',
				chartX: '=',
				chartY: '='
			},
			link: (scope, element, attributes) => {

				scope.chartOptions = {
					scales: {
						yAxes: [{
							id: 'y-axis-1',
							type: 'linear',
							display: true,
							position: 'left'
						}]
					}
				}

				scope.chartDataSetOverride = [{yAxisID: 'y-axis-1'}]
			}
		}
	}
})()