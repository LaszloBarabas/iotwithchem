(() => {
	angular.module('kemia-app')
         .controller('HomeController', HomeController)

	HomeController.$inject = ['$scope', 'usersFactory']

	function HomeController($scope, usersFactory) {
		let hc = this
		hc.users = []

		getUsers().then(() => {
		})

		function getUsers() {
			return usersFactory.getUsers()
							.then((users) => {
								hc.users = users
								return hc.users
							})
		}
	}
})()
