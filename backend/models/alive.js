'use strict'
var loaded = true;

let mongoose,Schema;

try{
  mongoose = require('mongoose')
}catch(e)
{
  loaded=false;
}

if(!loaded)
{
  try{
    mongoose = require('../pi/node_modules/mongoose')
  }catch(e){throw e}
}

Schema = mongoose.Schema
let aliveSchema = new Schema({
	raspberryid : String,
	alivedate : String
})

module.exports = mongoose.model('Alive', aliveSchema)
