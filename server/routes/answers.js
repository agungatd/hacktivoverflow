var express = require('express');
var router = express.Router();
const Answer = require('../models/answer')
const auth = require('../middleware/authentication')

router.get('/', (req, res, next) => {
  Answer.find({})
  .populate('user')
  .populate('question')
  .then((result) => {
    res.status(200).json(result)
  }).catch((err) => {
    res.status(500).json(err)
  });
})

router.get('/:questionId', (req, res, next) => {
  Answer.find({
    question: req.params.questionId
  })
  .populate('user')
  .populate('question')
  .then((result) => {
    res.status(200).json(result)
  }).catch((err) => {
    res.status(500).json(err)
  });
})

router.post('/', auth, (req, res)=>{
  Answer.create({
    user: req.body.user,
    answer: req.body.answer,
    question: req.body.question
  })
  .then((result) => {
    res.status(200).json(result)
  }).catch((err) => {
    res.status(500).json(err)
  });
})

router.put(`/:id`,  auth, (req, res)=>{
  Answer.findByIdAndUpdate(req.params.id, {
    user: req.body.user,
    answer: req.body.answer,
    question: req.body.question
  })
  .populate('user')
  .populate('question')
  .then((result) => {
    res.status(200).json(result)
  }).catch((err) => {
    res.status(500).json(err)
  });
})

router.put('/upvote/:id', auth, (req, res)=>{
  console.log('masuk upvote--', req.user, req.user)
  Question.findByIdAndUpdate(req.params.id, { 
    $pull: { 
      userLikes: req.user.id,
      userDislikes: req.user.id 
    }
  })
  .then((result) => {
    Question.findByIdAndUpdate(req.params.id, {
      $push: {
        userLikes: req.user.id
      }
    })
    .then(result=>{
      res.status(200).json(result)
    })
  }).catch((err) => {
    res.status(400).json(err)
  })
})

router.put('/downvote/:id', auth, (req, res)=>{
  console.log('masuk upvote--', req.user)
  Question.findByIdAndUpdate(req.params.id, { 
    $pull: { 
      userLikes: req.user.id,
      userDislikes: req.user.id 
    }
  })
  .then((result) => {
    Question.findByIdAndUpdate(req.params.id, {
      $push: {
        userDislikes: req.user.id
      }
    })
    .then(result=>{
      res.status(200).json(result)
    })
  }).catch((err) => {
    res.status(400).json(err)
  })
})
// router.delete('/:id',  auth, (req, res)=>{
//   Answer.findByIdAndDelete(req.params.id)
//   .then((result) => {
//     res.status(200).json(result)
//   }).catch((err) => {
//     res.status(500).json(err)
//   });
// })

module.exports = router