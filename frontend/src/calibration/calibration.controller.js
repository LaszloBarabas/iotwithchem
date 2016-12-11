(() => {
	angular.module('kemia-app')
		.controller('calibrationController', calibrationController)

	calibrationController.$inject = ['$timeout']

	function calibrationController($timeout) {
		let cc = this
		cc.sensors = ['Sensor 1', 'PH sensor', 'Sensor 3', 'Sensor 4']
		cc.sensor = 'PH sensor'
		cc.nanobar = new Nanobar({id: 'sensor-loading', target: document.getElementById('loading-bar')})

		cc.submitPHValue = submitPHValue

		function submitPHValue() {
			cc.nanobar.go(99)
			/*$timeout(() => {
				cc.nanobar.go(10)
			}, 500)
			$timeout(() => {
				cc.nanobar.go(50)
			}, 1500)
			$timeout(() => {
				cc.nanobar.go(100)
			}, 5000)*/
		}
	}
})()