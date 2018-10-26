<template>
  <div class="about">
    <div class="card">
      <img :src='avatar' alt="John" style="width:100%">
      <span style='color:blue; cursor:pointer' @click='changeAvatar'>change avatar</span>
      <h1>{{ username }}</h1>
      <p class="title">CEO & Founder, Example</p>
      <p>Harvard University</p>
      <div>
        <a href="#"><i class="fa fa-dribbble"></i></a> &nbsp;
        <a href="#"><i class="fa fa-twitter"></i></a> &nbsp;
        <a href="#"><i class="fa fa-linkedin"></i></a> &nbsp;
        <a href="#"><i class="fa fa-facebook"></i></a> &nbsp; 
      </div>
      <p><button>Contact</button></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import portUrl from '../../config.js'
import {mapActions, mapState} from "vuex"

  export default {
    data() {
      return{
        username: localStorage.getItem('username'),
        avatar: '',
        selectedFile: '',
        showUploadAvatar: false
      }
    },
    methods: {
      UploadAvatarInput() {
        this.showUploadAvatar = true
      },
      changeAvatar() {
        this.showUploadAvatar = false
        let self = this
        let id = localStorage.getItem('userId')
        axios.get(`https://randomuser.me/api/`)
        .then((result) => {
          self.avatar = result.data.results[0].picture.large
        }).catch((err) => {
          console.log(result)
        });
      },
      onFileSelected(event) {
        // console.log('upload event--', event)
        this.selectedFile = event.target.files[0]
      }
    },
    created() {
      this.username = localStorage.getItem('username')
      this.avatar = localStorage.getItem('avatar')
    },
    computed: {
    ...mapState(["isLogin"])
    }
  }
</script>

<style scoped>
.about {
  padding: 20px 0;
  background-color: none;
}

.card {
    margin-top: 30px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    max-width: 300px;
    margin: auto;
    text-align: center;
}

.title {
    color: grey;
    font-size: 18px;
}

button {
    border: none;
    outline: 0;
    display: inline-block;
    padding: 8px;
    color: white;
    background-color: #000;
    text-align: center;
    cursor: pointer;
    width: 100%;
    font-size: 18px;
}

a {
    text-decoration: none;
    font-size: 22px;
    color: black;
}

button:hover, a:hover {
    opacity: 0.7;
}

</style>