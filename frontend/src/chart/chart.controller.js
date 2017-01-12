(() => {
	var app = angular.module('kemia-app')
	app.controller('chartController', chartController)

	chartController.$inject = ['$scope', 'chartFactory', 'moment','$interval']

	function chartController($scope, chartFactory, moment,$interval)
	{
		let temp=this
		let sensorid = 1
		let val = 26*60*60*1000

		temp.temperature=0.0

		$scope.getVal = function(value)
		{
			sensorid = 1
			val = value
			getTemperatureInterval()
		}

		$interval(getTemperatureInterval, 1000)

		function getTemperatureInterval()
		{
			var datefrom = new moment().valueOf()-val
			var dateto = new moment().valueOf()
			return chartFactory.getTemperatureInterval(sensorid, datefrom, dateto)
			.then((data) => {
				console.log('TEMPERATURE CHART: ',datefrom)
				$scope.tempV = []
				$scope.tempD = []
				let temporaryTemperatures = []
				let temporaryDates = []
				for (let i = 1; i < data.length; i += 1)
				{
					let date = (new moment(parseInt(data[i].tempdate)).toISOString().split('.'))[0].replace('T',' ')
					if(temporaryTemperatures[temporaryTemperatures.length-1] != data[i].tempvalue)
					{
						temporaryTemperatures.push(data[i].tempvalue)
						temporaryDates.push(moment(date).format('YY/MM/DD, h:mm:ss a'))
					}
				}
				$scope.tempV = [temporaryTemperatures]
				$scope.tempD = temporaryDates

				$scope.onClick = function (points, evt)
				{
					console.info(points, evt)
				}
				$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }]
				$scope.options = {
					scales: {
						yAxes: [
							{
								id: 'y-axis-1',
								type: 'linear',
								display: true,
								position: 'left'
							}
						]
					}
				}
				$scope.colors = ['#68d6dd']
				return temp.temperature
			})
		}
	}
})()
