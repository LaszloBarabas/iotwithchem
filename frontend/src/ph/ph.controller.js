(() => {
	angular.module('kemia-app')
	.controller('phController', phController)

	phController.$inject = ['$scope', 'phFactory','$interval','$window']

	function phController($scope, phFactory,$interval,$window) {
		let temp=this
		temp.ph=0.0
		getPh().then(() => {
		})

		function getPh() {
			return phFactory.getPh()
			.then((ph) => {
				temp.ph = ph
				$scope.phValue=temp.ph.phvalue
				$scope.phDate=temp.ph.phdate
				return temp.ph
			})
		}
		$interval(getPh, 3000)

		$scope.setHeaterPh=function(){
			let resp=phFactory.setHeaterPh($scope.settedPh)
			$window.alert('Successful')
			console.log(resp)
		}
	}
})()