/*!
 * SWITCHSTYLE JOB SCHEDULER
 */

// loading dependencies
const User = require('../models/user')
const moment = require('moment')

// start up scheduler
var scheduler = function () {
  setInitialUpdateTime()
  setInterval(nextUpdate, 30000)
}

// set users initial values
function setInitialUpdateTime () {
  User.find({}).then(function (users) {
    for (var i = 0; i < users.length; i++) {
    	var frequency = users[i].frequency
    	var unity = users[i].unity
    	var unityDesc = getUnityDesc(unity)
    	var nextupdate = moment().add(frequency, unityDesc)
      User.findByIdAndUpdate(users[i]._id, { next_update: nextupdate }, function (err, user) {
      	if (err) {
        	console.log('error: ', err)
        }
      })
    }
  })
}

// set next scheduled update
function nextUpdate () {
  User.find({}).then(function (users) {
  	for (var i = 0; i < users.length; i++) {
  		var frequency = users[i].frequency
  		var unity = users[i].unity
  		var dateFormat = getDateFormat(unity)
  		var now = moment().format(dateFormat)
  		var scheduled = moment(users[i].next_update).format(dateFormat)
  		var unityDesc = getUnityDesc(unity)
  		var nextupdate = moment().add(frequency, unityDesc)
  		// find a time match
    	if (now === scheduled) {
  	 		// loop through user urls to set the next active image
      	var userUrls = users[i].urls
      	for (var u=0; u < userUrls.length; u++) {
      		if (userUrls[u].active === true) {
      			// if is last element, set the first as the active image
      			if (u === userUrls.length-1) {
      				userUrls[u].active = false
      				userUrls[0].active = true
      			} else {
      				// set the next element as the active image
      				userUrls[u].active = false
      				userUrls[u + 1].active = true
      				break
      			}
      		}
      	}

    	  // update user's active image / next update time
    	  User.findByIdAndUpdate(users[i]._id, { next_update: nextupdate, urls: users[i].urls }, function (err, user) {
        	if (err) {
          	console.log('error: ', err)
        	}
      	})
    	}
  	}
  })
}

// get date format based on unity (m-minutes, h-hours, d-days)
function getDateFormat (unity) {
  var dateFormat = 'error'
  if (unity === 'm') {
    dateFormat = 'MMMM Do YYYY, h:mm'
  } else if (unity === 'h') {
    dateFormat = 'MMMM Do YYYY, h'
  } else if (unity === 'd') {
    dateFormat = 'MMMM Do YYYY'
  }
  return dateFormat
}

// get unity description
function getUnityDesc (unity) {
  var unityDesc = 'error'
  switch (unity) {
  	case 'm':
  		unityDesc = 'minutes'
  		break
  	case 'h':
  		unityDesc = 'hours'
  		break
    case 'd':
    	unityDesc = 'hours'
  }
  return unityDesc
}

// exports module
module.exports = scheduler
