(() => {
	angular.module('kemia-app')
		.controller('statusController', statusController)

	statusController.$inject = ['statusFactory', '$interval']

	function statusController(statusFactory, $interval) {
		let sc = this
		sc.status = false

		sc.loadStatus = loadStatus;

		loadStatus()
		// $interval(loadStatus, 3000)

		function loadStatus() {
			getStatus()

			function getStatus() {
				return statusFactory.getStatus()
					.then((response) => {
						sc.status = response
						sc.alive = response.alive
						console.log('response', response)
						return sc.status
					})
			}
		}
	}
})()
