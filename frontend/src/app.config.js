(() => {
	angular.module('kemia-app')
		.config(chartConfig)

	chartConfig.$inject = ['ChartJsProvider']

	function chartConfig(ChartJsProvider) {
		ChartJsProvider.setOptions({
			colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
		})
	}

	// RUN BLOCK
	angular.module('kemia-app').run(kemiaRunBlock)
	kemiaRunBlock.$inject = ['$rootScope', '$state', 'authenticationFactory']

	function kemiaRunBlock($rootScope, $state, authenticationFactory) {
		$rootScope.$on('$stateChangeStart', (event, toState) => {
			if (toState.authenticate) {
				authenticationFactory.checkAuth().then((response) => {

					if (response.status === 'unauthenticated') {
						// User isn’t authenticated
						$state.go('login')
						event.preventDefault()
					}
				})
			}
		})
	}
})()