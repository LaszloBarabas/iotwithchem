(() => {
	angular.module('kemia-app')
		.controller('statusController', statusController)

	statusController.$inject = ['$scope', 'statusFactory', '$interval']

	function statusController($scope, statusFactory, $interval) {
		let st = this
		st.status = false

		getStatus().then(() => {
		})

		$interval(getStatus, 3000)

		function getStatus() {
			return statusFactory.getStatus()
				.then((status) => {
					st.status = status
					$scope.status = st.status.alive
					return st.status
				})
		}
	}
})()
