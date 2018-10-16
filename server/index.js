const express = require('express')
const routes = require('./routes/api')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config/server')
const scheduler = require('./scheduler/jobs')
const cors = require('cors')

// set up express up
const app = express()

// connect to mongodb
mongoose.connect(config.db_uri)
mongoose.Promise = global.Promise

// initialize body-parser
app.use(bodyParser.json())

app.use(cors())

// initialize routes
app.use('/api', routes)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// error handling middleware
app.use(function (err, req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  res.status(422).send({error: err.message})
  console.log(err)
})

// start job scheduler()
scheduler()

// starting server
app.listen(process.env.port || config.port, function () {
  console.log('listening for requests @ port '+config.port)
})