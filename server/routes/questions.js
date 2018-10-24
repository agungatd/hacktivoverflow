var express = require('express');
var router = express.Router();
const Question = require('../models/question')
const auth = require('../middleware/authentication')

router.post('/', auth, (req, res)=>{
  console.log('masuk server create question', req.body.tags)
  Question.create({
    questioner: req.body.questioner,
    title: req.body.title,
    contents: req.body.contents
    ,tags: req.body.tags
  })
  .then((result) => {
    res.status(201).json(result)
  }).catch((err) => {
    console.log(err)
    res.status(400).json(err)
  });                                                                                                                                                                                                                                                                                                              
})

router.get('/', (req, res)=>{
  Question.find({})
  .populate('questioner')
  .populate('answers')
  .then((result) => {
    res.status(200).json(result)
  }).catch((err) => {
    res.status(400).json(err)
  });
})

router.get('/:id', (req, res)=>{
  Question.findById(req.params.id)
  .populate('questioner')
  .populate('answers')
  .then((result) => {
    res.status(200).json(result)
  }).catch((err) => {
    res.status(400).json(err)
  });
})

router.put('/:id', auth, (req, res)=>{
  console.log('MASUK EDIT SERVER QUESTION=', req.params.id, req.body)
  Question.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    contents: req.body.contents,
    tags: req.body.tags
  })
  .then((result) => {
    console.log('==========>', result)
    res.status(200).json(result)
  }).catch((err) => {
    res.status(400).json(err)
  });
})

router.patch('/:id/:key/:value', auth, (req, res)=>{
  Question.findByIdAndUpdate(req.params.id, {
    [[req.params.key]]: req.params.value
  })
  .then((result) => {
    console.log('==========>', result)
    res.status(200).json(result)
  }).catch((err) => {
    res.status(400).json(err)
  });
})

router.delete('/:id', auth, (req, res)=>{
  Question.findByIdAndDelete(req.params.id)
  .then((result) => {
    console.log('==========>', result)
    res.status(200).json(result)
  }).catch((err) => {
    res.status(400).json(err)
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

router.put('/views/:id', (req, res)=>{
  Question.findById(req.params.id)
  .then((result) => {
    let newView = result.data.views++
    Question.updateOne({
      views: newView
    })
    then(result=>{
      res.status(200).json(result)
    })
  }).catch((err) => {
    res.status(400).json(err)
  });
})

module.exports = router