(() => {
	angular.module('kemia-app')
	.controller('calibrationController', calibrationController)

	calibrationController.$inject = ['$scope', 'calibrationFactory','$interval']

	function calibrationController($scope, calibrationFactory,$interval) {
		let temp=this
		temp.ph=0.0
		getPh().then(() => {
		})

		function getPh() {
			return calibrationFactory.getPh()
			.then((ph) => {
				temp.ph = ph
				$scope.phValue=temp.ph.phvalue
				$scope.phDate=temp.ph.phdate
				return temp.ph
			})
		}
		$interval(getPh, 3000)

		$scope.calibrationlow=function()
        {
			//$window.alert('mak')
			calibrationlow()
		}

		function calibrationlow() {      
			return calibrationFactory.calibratephsensorlow()
		}

		$scope.calibrationmid=function()
        {
			//$window.alert('mak')
			calibrationmid()
		}

		function calibrationmid() {      
			return calibrationFactory.calibratephsensormid()
		}

		$scope.calibrationhigh=function()
        {
			//$window.alert('mak')
			calibrationhigh()
		}

		function calibrationhigh() {      
			return calibrationFactory.calibratephsensorhigh()
		}
	}
})()