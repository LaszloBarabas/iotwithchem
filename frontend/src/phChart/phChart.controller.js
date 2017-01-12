(() => {
	var app = angular.module('kemia-app')
	app.controller('phChartController', phChartController)

	phChartController.$inject = ['$scope', 'phChartFactory', 'moment','$interval']

	function phChartController($scope, phChartFactory, moment,$interval)
	{
		let p=this
		let sensorid = 1
		let val = 24*60*60*1000

		p.ph=0.0

		$scope.getValPh = function(value)
		{
			sensorid = 1
			val = value
			getPhInterval()
		}

		$interval(getPhInterval, 1000)

		function getPhInterval()
		{
			var datefrom = new moment().valueOf()-val
			var dateto = new moment().valueOf()
			return phChartFactory.getPhInterval(sensorid, datefrom, dateto)
			.then((data) => {
				console.log('PH CHART: ', datefrom, dateto, data.length)
				$scope.phV = []
				$scope.phD = []
				let temporaryPhs = []
				let temporaryDates = []
				for (let i = 1; i < data.length; i += 1)
				{
					let date = (new moment(parseInt(data[i].phdate)).toISOString().split('.'))[0].replace('T',' ')
					if(temporaryPhs[temporaryPhs.length-1] != data[i].phvalue)
					{
						temporaryPhs.push(data[i].phvalue)
						temporaryDates.push(moment(date).format('YY/MM/DD, h:mm:ss a'))
					}
				}
				$scope.phV = [temporaryPhs]
				$scope.phD = temporaryDates

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
				$scope.colors = ['#ff87cb'] //#db04bb']'#08ce40']
				return p.ph
			})
		}
	}
})()
