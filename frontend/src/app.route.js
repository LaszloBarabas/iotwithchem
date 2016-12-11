(() => {
	angular.module('kemia-app')
         .config(routing)

	routing.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

	function routing($stateProvider, $urlRouterProvider, $locationProvider) {
		let helloState = {
			name: 'home',
			url: '/home',
			templateUrl: 'frontend/src/home/home.html',
			controller: 'HomeController',
			controllerAs: 'hc',
			authenticate: false
		}

		let researchState = {
			name: 'research',
			url: '/research',
			templateUrl: 'frontend/src/research/research.html',
			controller: 'researchController',
			controllerAs: 'rc',
			authenticate: true
		}

		let teamState = {
			name: 'team',
			url: '/team',
			templateUrl: 'frontend/src/team/team.html',
			controller: 'teamController',
			controllerAs: 'team',
			authenticate: true
		}

		let loginState = {
			name: 'login',
			url: '/login',
			templateUrl: 'frontend/src/login/login.html',
			authenticate: false
		}

		let calibrationState = {
			name: 'calibration',
			url: '/calibration',
			templateUrl: 'frontend/src/calibration/calibration.html',
			controller: 'calibrationController',
			controllerAs: 'cc',
			authenticate: true
		}

		$stateProvider.state(helloState)
		$stateProvider.state(researchState)
		$stateProvider.state(teamState)
		$stateProvider.state(loginState)
		$stateProvider.state(calibrationState)

		$urlRouterProvider.otherwise('/home')
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		})
	}
})()
