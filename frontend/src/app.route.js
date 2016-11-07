(() => {
  angular.module('kemia-app')
         .config(routing)

  routing.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

  function routing($stateProvider, $urlRouterProvider, $locationProvider) {
    var helloState = {
      name: 'home',
      url: '/home',
      templateUrl: 'frontend/src/home/home.html',
      controller: 'HomeController',
      controllerAs: 'hc'
    }

    var aboutState = {
      name: 'about',
      url: '/about',
      template: '<h3>About page</h3>'
    }

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    })

    $stateProvider.state(helloState);
    $stateProvider.state(aboutState);
  }
})()
