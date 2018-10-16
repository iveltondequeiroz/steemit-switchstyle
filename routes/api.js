/*!
 * FLIP-COVER REST API
 */

// loading dependencies
const express = require('express')
const router = express.Router()
const User = require('../models/user')

// get a list of users from the db
router.get('/users', function (req, res) {
  User.find({}).then(function (users) {
    res.send(users)
  })
})

// add a new user to the db
router.post('/users', function (req, res, next) {
  User.create(req.body).then(function (user) {
    res.send(user)
  }).catch(next)
})

// delete a user from the db
router.delete('/users/:id', function (req, res, next) {
  User.findByIdAndRemove({_id: req.params.id}).then(function (user) {
    res.send(user)
  }).catch(next)
})

// update a user in the db
router.put('/users/:id', function (req, res) {
  User.findByIdAndUpdate({_id: req.params.id}, req.body).then(function (user) {
    User.findOne({_id: req.params.id}).then(function (user) {
      res.send(user)
    })
  })
})

// get a list of users from the db
router.get('/userbyname/:name', function (req, res) {
  User.findOne({username: req.params.name}).then(function (user) {
    res.send(user)
  })
})

// exporting module
module.exports = router
