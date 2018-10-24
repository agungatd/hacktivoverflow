var express = require('express');
var router = express.Router();
const User = require('../models/user')
const hash = require('../helpers/hash')
const jwt = require('jsonwebtoken')
const axios = require('axios')
// import auth from '../middleware/authentication'

/* GET users listing. */
router.get('/', (req, res)=>{
  User.find()
  .then((result) => {
    res.status(200).json(result)
  }).catch((err) => {
    res.status(400).json(err)
  });
})

router.get('/google-login', (req, res)=>{
  let token = req.headers.id_token

  axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)
  .then((result) => {
    User.findOne({
      email: result.data.email
    })
    .then(resu=>{
      if(!resu) {
        User.create({
          avatar: result.data.picture,
          username: result.data.name,
          email: result.data.email,
          password: hash.hash(process.env.LOGIN_FROM_GOOGLE_PASS)
        })
        .then(result2=>{  
          res.status(200).json({ 
            result:result.data,
            email:result.data.email, 
            username:result.data.name, 
            avatar:result.data.picture, 
            googlePass:process.env.LOGIN_FROM_GOOGLE_PASS
          })
        })
      } else {
        res.status(200).json({ 
          result:result.data,
          email:result.data.email, 
          username:result.data.name, 
          avatar:result.data.picture, 
          googlePass:process.env.LOGIN_FROM_GOOGLE_PASS
        })
      }
    })
  }).catch((err) => {
    res.status(400).json(err)
  });
  
})

router.patch('/:id', (req, res)=>{
})

router.post('/register', (req, res)=>{
  console.log(req.body)
  User.create({
    avatar: req.body.avatar,
    username: req.body.username,
    email: req.body.email,
    password: hash.hash(req.body.password)
  })
  .then((result) => {
    console.log('masuk Router register user*****', result)
    res.status(200).json(result)
  }).catch((err) => {
    res.status(400).json(err)
  });
});

router.post('/signin', (req, res)=>{
  User.findOne({
    email: req.body.email
  })
  .then((result) => {
    if(hash.decodePass(result.password,req.body.password)===false) {
      res.status(400).json({message:'Please insert the correct password!'})
    } else
    if(!result) {
      res.status(400).json({message:'Please fill in the form correctly!'})
    } else {
      let token = jwt.sign({id:result._id, email:result.email}, process.env.JWT_KEY)
      res.status(200).json({result,token,username:result.username,avatar:result.avatar})
    }
  }).catch((err) => {
    res.status(400).json(err)
  });
});


module.exports = router;
