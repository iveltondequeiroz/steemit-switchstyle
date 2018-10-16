const mongoose = require('mongoose')
const Schema = mongoose.Schema
// create schema and model
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'User name field is required']
  },
  unity: {
    type: String,
    required: [true, 'Unity field is required']
  },
  frequency: {
    type: Number,
    required: [true, 'Frequency field is required']
  },
  urls: {
    type: Array,
    required: [true, 'Image URL field is required']
  },
  next_update: {
    type: Date,
    required: [true, 'next update field is required']
  }
})

const User = mongoose.model('user', UserSchema)

module.exports = User
