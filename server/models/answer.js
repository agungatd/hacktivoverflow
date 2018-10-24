const mongoose = require('mongoose');
mongoose.connect(`${process.env.MONGODB_URL}`);
var Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  question: {
    type: Schema.Types.ObjectId, 
    ref: 'Question' 
  },
  answer: {
    type: String,
    required: true
  },
  userLike: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  userDislike: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  solving: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const Answer = mongoose.model('Answer', AnswerSchema)

module.exports = Answer