<template>
  <div id='login-form'>
      <div style='text-align: center'>
        <div id="my-signin2" style='display: inline-block'></div>
      </div>
      <div>Or fill login form manually with your registered account below:</div><hr>
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" v-model='email'>
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model='password'>
      </div>
      <h6>Does not have an account yet?&nbsp;<span id='register'data-toggle="modal" data-target="#registerModal">Register</span></h6>
        <div class="alert alert-success" role="alert" v-if='success'>
          Yes {{ msg }}
        </div>
        <div class="alert alert-danger" role="alert" v-if='error'>
          No {{ msg }}
        </div>
      <button type="submit" class="btn btn-primary" @click='login(email, password)'>Login</button>

      <!-- MODAL - Registration -->
      <div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Register Here:</h5>
              
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
             <!-- <div class="form-group">
                <label for="exampleInputAvatar">Avatar</label>
                <input class="form-control" type="file" name="image" id="" @change='onFileSelected'>
              </div> -->
              <div class="form-group">
                <label for="exampleInputUsername1">Username</label>
                <input type="text" class="form-control" id="exampleInputUsername1" placeholder="Enter Username" v-model='username'>
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Enter email" v-model='email'>
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword2" placeholder="Password" v-model='password'>
              </div>
            </div>
            <div class="alert alert-success" role="alert" v-if='success'>
              {{ msg }}
            </div>
            <div class="alert alert-danger" role="alert" v-if='error'>
              {{ msg }}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click='register'>Sign Up</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal" @click='clearState'>Close</button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script> 
import axios from 'axios'
import portUrl from '../../config.js'
import {mapActions, mapState} from "vuex"

export default {
  props: ['token'],
  data() {
    return {
      avatar: '',
      username: '',
      email: '',
      password: '',
      msg: '',
      success: false,
      error: false
    }
  },
  mounted() {
    this.renderButton()
  },
  computed: {
    ...mapState(["isLogin"])
  },
  methods: {
    ...mapActions(["getIsLogin", "getUsername", "getUserId"]),
    neutralize(){
      this.msg = '',
      this.error = false,
      this.success = false
    },
    onSuccess(googleUser) {
      console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
      // console.log(googleUser.Zi.access_token)
      this.loginByGoogle(googleUser.Zi.id_token)
    },
    loginByGoogle(token) {
      let self = this
      axios({
        url:`${portUrl}/users/google-login`,
        method: 'GET',
        headers: {
          id_token: token
        }
      })
      .then((result) => {
        // console.log('berhasil login google---->', result)
        self.login(result.data.email, result.data.googlePass)
      }).catch((err) => {
        // console.log(err.response, err)
      });
    },
    renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': this.onSuccess
      })
    },
    register() {
      let self = this
       axios.get(`https://randomuser.me/api`)
        .then((result) => {
          // console.log('masuk register user*****')

          axios.post(`${portUrl}/users/register`, {
            avatar: result.data.results[0].picture.large,
            username: self.username,  
            email: self.email,
            password: self.password
          })
          .then((result) => {
            // console.log('success register in then')
            self.success = true
            self.error = false
            self.msg = 'Successfully registered!'
            this.$router.push({ path: `/login` })
          })
          .catch(err=>{
            self.success = false
            self.error = true
            self.msg = err.response.data.message || 'invalid email/password!'
            // console.log('error when registration', err)
          })
        }).catch((err) => {
          self.success = false
            self.error = true
            self.msg = err.response.data.message || 'Bad request!'
          // console.log('FAIL get avatarr catch--',err.response)
        });
    },
    login(email, password) {
      this.clearState()
      let self = this
      axios.post(`${portUrl}/users/signin`, {
        email: email,
        password: password
      })
      .then((result) => {
        if(result.data===false) {
          self.success = false
          self.error = true
          self.msg = 'formnya!!'
        } else {
          self.success = true
          self.error = false
          self.msg = 'Successfully Log in!'
          let userId = result.data.result._id
          let username = result.data.username
          localStorage.setItem('token',result.data.token)
          localStorage.setItem('userId', userId)
          localStorage.setItem('username', username)
          localStorage.setItem('avatar', result.data.avatar)
          this.getIsLogin(true)
          this.getUserId(userId)
          this.getUsername(username)
        }
          self.clearState()
          this.$router.push({ path: `/` })
      })
      .catch((err) => {
        // console.log('masuk catch')
        self.success = false
        self.error = true
        if(!err.response.data.message) {
          self.msg = 'Please fill in the form!'
        } else {
          self.msg = err.response.data.message || err
        }
      });
    },
    clearState() {
      this.avatar=''
      this.username= '',
      this.email= '',
      this.password= ''
      this.success = false
      this.error = false
    },
    onFileSelected(event) {
      // console.log('upload event--', event)
      this.selectedFile = event.target.files[0]
    }

  },
  created() {
  },
  
}
</script>

<style >
  #login-form {
    background-color: white;
    padding: 20px;
  }
  #register {
    color:blue;
  }
  h6 #register:hover {
    color: slateblue;
    background-color: wheat;
    cursor: pointer;
  }
</style>
