const mongoose = require('mongoose');
mongoose.connect(`${process.env.MONGODB_URL}`);
var Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  questioner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  title: {
    type: String,
    required: true
  },
  contents: {
    type: String
  },
  tags: [String]
  ,userLikes: [{
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }],
  userDislikes: [{
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const Question = mongoose.model('Question', QuestionSchema)

module.exports = Question