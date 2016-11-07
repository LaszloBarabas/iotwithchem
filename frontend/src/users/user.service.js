(() => {
  angular.module('kemia-app')
         .factory('usersFactory', usersFactory)

  usersFactory.$inject = ['$http']

  function usersFactory($http) {
    return {
      getUsers: getUsers
    }

    function getUsers() {
      return $http.get('/users')
                  .then(getUsersComplete)
                  .catch(getUsersError)
    }

    function getUsersComplete(response) {
      return response.data;
    }

    function getUsersError(error) {
      console.log('An error occured while getting the users: ', error);
    }
  }
})()
