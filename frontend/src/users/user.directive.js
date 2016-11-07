(() => {
  angular.module('kemia-app')
         .directive('myUser', myUser)

  myUser.$inject = []

  function myUser() {
    return {
      restrict: 'E',
      scope: {
        user: '='
      },
      templateUrl: 'frontend/src/users/user.html'
    }
  }
})()
