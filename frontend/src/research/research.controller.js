(() => {
	angular.module('kemia-app')
		.controller('researchController', researchController)

	researchController.$inject = ['$interval', 'temperatureFactory']

	function researchController($interval, temperatureFactory) {

		let rc = this

		rc.sensorId = 1
		rc.tempInterval = 72	 // hours
		rc.date = {
			to: new moment(),
			from: new moment().subtract(rc.tempInterval, 'hours'),
			update: updateDate
		}

		loadLastTemperature()


		function loadLastTemperature() {
			getLastTemperature()

			function getLastTemperature() {
				return temperatureFactory.getLastMeasuredTemperature()
					.then((temp) => {
						console.log('got it', temp)
						rc.lastMeasureDate = moment(parseInt(temp.tempdate)).format('ddd hh:mm:ss')
						console.log('rc.lastMeasureDate', rc.lastMeasureDate)
						rc.lastMeasuredValue = temp.tempvalue
					})
			}
		}

		temperatureFactory.getTemperatureInterval(rc.sensorId, convertToMillis(rc.date.from), convertToMillis(rc.date.to))
			.then((tempInterval) => {
				console.log('tempinterval', tempInterval)
			})

		temperatureFactory.setTemperatureTime(rc.sensorId, rc.tempInterval)
			.then((response) => {
				console.log('set temp interval response', response)
			})










		function convertToMillis(date) {
			return moment(date).valueOf()
		}

		function updateDate() {
			this.to = new moment()
			this.from = new moment().subtract(rc.tempInterval, 'hours')
		}

		/*rc.sensorId = 1
		rc.tempInterval = 72	 // hours
		rc.date = {
			to: new moment(),
			from: new moment().subtract(rc.tempInterval, 'hours'),
			update: updateDate
		}


		rc.setInterval = function() {
			rc.date.update()
			getTemperatureInterval()
		}

		// $interval(getTemperatureInterval, 3000)
		getTemperatureInterval()

		function getTemperatureInterval() {
			return chartFactory.getTemperatureInterval(rc.sensorId, convertToMillis(rc.date.from), convertToMillis(rc.date.to))
				.then((data) => {

					rc.chartLabels = []
					rc.chartData = []

					data.forEach((temperature) => {
						if (rc.chartData[rc.chartData.length - 1] != temperature.tempvalue) {
							rc.chartData.push(temperature.tempvalue)
							rc.chartLabels.push(moment(parseInt(temperature.tempdate)).format('ddd hh:mm:ss'))
						}
					})

					rc.chartDataSetOverride = [{yAxisID: 'y-axis-1'}]
					rc.chartOptions = {
						scales: {
							yAxes: [{
								id: 'y-axis-1',
								type: 'linear',
								display: true,
								position: 'left'
							}]
						}
					}
					return data
				})
		}*/
	}
})()