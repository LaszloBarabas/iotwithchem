(() => {
	angular.module('kemia-app')
		.controller('researchController', researchController)

	researchController.$inject = ['$interval', 'temperatureFactory']

	function researchController($interval, temperatureFactory) {

		let rc = this

		const RESEARCH_DATE_FORMAT = 'MM/DD ddd hh:mm:ss'

		rc.sensorId = 1
		rc.tempInterval = 336	 // hours
		rc.date = {
			to: new moment(),
			from: new moment().subtract(rc.tempInterval, 'hours'),
			update: updateDate
		}

		rc.tempChart = {}
		rc.loadTempsDone = false

		loadLastTemperature()
		loadTemperatureInterval()
			.then((response) => {
				rc.loadTempsDone = true
			})
		uploadTemperatureInterval()


		function loadLastTemperature() {
			return getLastTemperature()
				.then((response) => {
					return response
				})

			function getLastTemperature() {
				return temperatureFactory.getLastMeasuredTemperature()
					.then((temp) => {
						rc.lastMeasureDate = moment(parseInt(temp.tempdate)).format(RESEARCH_DATE_FORMAT)
						rc.lastMeasuredValue = temp.tempvalue
					})
			}
		}

		function loadTemperatureInterval() {
			return getTemperatureInterval()
				.then((response) => {
					console.log('in the', response)
					return response
				})

			function getTemperatureInterval() {
				return temperatureFactory.getTemperatureInterval(rc.sensorId, convertToMillis(rc.date.from), convertToMillis(rc.date.to))
					.then((tempInterval) => {

						rc.tempChart.tempDates = tempInterval.map((temperature) => {
							return moment(parseInt(temperature.tempdate)).format(RESEARCH_DATE_FORMAT)
						})

						rc.tempChart.tempValues = tempInterval.map((temperature) => {
							return temperature.tempvalue
						})

						return rc.tempChart
					})
			}
		}

		function uploadTemperatureInterval() {
			return setTemperatureInterval()

			function setTemperatureInterval() {
				return temperatureFactory.setTemperatureInterval(rc.sensorId, rc.tempInterval)
					.then((response) => {
						console.log('set temp interval response', response)
					})
			}
		}


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