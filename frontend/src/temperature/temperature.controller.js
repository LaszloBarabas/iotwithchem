(() => {
	angular.module('kemia-app')
	.controller('temperatureController', temperatureController)

	temperatureController.$inject = ['$scope', 'temperatureFactory','$interval','$window']

	function temperatureController($scope, temperatureFactory,$interval,$window) {
		let temp=this
		temp.temperature=0.0
		$scope.interval=3
		let tempValue=0
		let tempDate=0
		getTemperature().then(() => {
		})
		function refresh(){
			$scope.temperatureValue=tempValue
			$scope.temperatureDate=tempDate
		}
		function getTemperature() {
			return temperatureFactory.getTemperature()
			.then((temperature) => {
				let oldDate=$scope.temperatureDate
				temp.temperature = temperature
				tempValue=temp.temperature.tempvalue
				tempDate=temp.temperature.tempdate
				refresh()
				//console.log(oldDate)
				//console.log(temp.temperature.tempdate-$scope.interval*1000)
				if(oldDate-$scope.interval*1000>temp.temperature.tempdate){
					$scope.status=false
				}
				else {
					$scope.status=true
				}
				return temp.temperature
			})
		}
		$interval(getTemperature, $scope.interval*1000)

		$scope.setTemperatureTime=function() {
			//$interval.cancel(refreshId)
			//interval = $scope.interval
			setTemperatureTime()
			//if (refreshId!=0){
			$window.alert('Successful')
			//}
			//refreshId=$interval(getTemperature, interval*1000)
		}

		function setTemperatureTime() {
			return temperatureFactory.setTemperatureTime(1, $scope.interval*1000)
		}

		$scope.setHeaterTemperature=function(){
			let resp=temperatureFactory.setHeaterTemperature($scope.settedTemperature)
			$window.alert('Successful')
			console.log(resp)
		}
	}
})()
