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
			controller: 'chartController',
			controllerAs: 'chart',
			authenticate: true
		}

		let teamState = {
			name: 'team',
			url: '/team',
			templateUrl: 'frontend/src/team/team.html',
			controller: 'TeamController',
			controllerAs: 'team',
			authenticate: false
		}

		let loginState = {
			name: 'login',
			url: '/login',
			templateUrl: 'frontend/src/login/login.html',
			controller: 'loginController',
			controllerAs: 'lc',
			authenticate: false
		}

		let loginState = {
			name: 'login',
			url: '/login',
			templateUrl: 'frontend/src/login/login.html',
			controller: 'loginController',
			controllerAs: 'lc',
			authenticate: false
		}

		$urlRouterProvider.otherwise('/')
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		})

		$stateProvider.state(helloState)
		$stateProvider.state(researchState)
		$stateProvider.state(teamState)
		$stateProvider.state(loginState)

		$urlRouterProvider.otherwise('/home')
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		})
	}
})()
