const mongoose = require('mongoose');
mongoose.connect(`${process.env.MONGODB_URL}`);
var Schema = mongoose.Schema;
const sendEmail = require('../helpers/sendMailCron')

var validateEmail = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
};

const UserSchema = new Schema({
  avatar: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: [6,'Password length minimal is 6 characters!']
  }
}, {
  timestamps: true
})

// UserSchema.post('save', function() {
//   console.log('masuk hooks:', this.email)
//   sendEmail(this.email)
// });

const User = mongoose.model('User', UserSchema)

module.exports = User