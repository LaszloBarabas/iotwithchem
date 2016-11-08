'use strict'

let express = require('express'),
	app = express(),
	mongoose = require('mongoose')

// set port
app.set('port', process.env.PORT || 8081)

app.use(express.static(__dirname + ''))

// database connection settings
mongoose.connection.on('open', (ref) => {
	console.info('Connected to mongo server.', ref)
})

mongoose.connection.on('error', (error) => {
	console.error('Could not connect to mongo server!', error)
})

// connect to database on mongolab
mongoose.connect('mongodb://votiv:votiv@ds031257.mlab.com:31257/kemia-db')

// routing
require('./backend/routes')(app)

// run
app.listen(app.get('port'), () => {
	console.info('App is running on port ', app.get('port'))
})

exports = module.exports = app
