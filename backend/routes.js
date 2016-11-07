'use strict'

let path = require('path'),
    mongoose = require('mongoose'),
    User = require(path.resolve('backend/models/users.js'))

module.exports = (app) => {
  app.get('/users', (request, response) => {

    User.find((error, users) => {
      if (error) { response.send(error) }

      response.json(users)
    })
  })

  app.get('*', (request, response) => {
    response.sendFile(path.resolve('frontend/index.html'));
  });
}
