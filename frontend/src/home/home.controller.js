(() => {
  angular.module('kemia-app')
         .controller('HomeController', HomeController)

  HomeController.$inject = ['$scope', 'usersFactory']

  function HomeController($scope, usersFactory) {
    let hc = this
    hc.users = []

    getUsers().then(() => {
      console.log('HomeController', hc.users[0].userName);
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
