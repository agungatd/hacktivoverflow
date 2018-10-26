<template>
  <div class='side-bar'>
    <br>
    <h3>List of Questions:</h3> 
    <div>
      <i class="fa fa-search"></i>
      <input type="text" class="form-group" placeholder="Search by question.." @keyup='searchQuestion' v-model='query'>
      <div class='row' style='border-bottom:3px solid darkblue; padding-bottom:10px;'>
        <div class='col-sm-12'>
          <button class='btn-sm btn-dark' v-if='isLogin' @click='showMyQuestions'>Show my questions only</button>
        </div>
        <div class='col-sm-12'>
          <button class='btn-sm btn-light' v-if='isLogin' @click='getQuestions'>Show all questions</button>
        </div>
      </div>
    </div>
    <div class="text py-4" v-for='question in questions'>
      <div class="meta">
        <div><small>{{ getDate(question.date) }}</small></div>
        <div style='color: blue;'><p>By {{question.questioner.username}}</p></div>
      </div>

      <h4 class="heading" style='color: blue;'>{{question.title}}</h4>
      <p v-html='question.contents'>...</p>
      <router-link :to="{ path: `/question/${question.id}`}">
        <span id='read' style='color:blue' @click='addView'>Read more</span>
      </router-link>
      <div class='row'>
        <div class='col-sm-4'>
          <i class="fa fa-heart"></i> Likes {{question.likes}}
        </div>
        <div class='offset col-sm-4'></div>
        <div class='col-sm-4' >
          <i class="fa fa-eye" aria-hidden="true"></i> Read {{ question.views }}
        </div>
      </div><hr>
    </div>

  </div>
</template>

<script>
  import portUrl from '../../config.js'
  import {mapActions, mapState} from "vuex"

  export default {
    props: [ 'userId', 'getDate'],
    data() {
      return {
        questions: [],
        title: '',
        contents: '',
        image: '',
        author: '',
        query: '',
        readCounter: 0,
        mine: false,
        msg: '',
        success: false,
        error: false,
        showComments: false
      }
    },
    computed: {
      ...mapState(["isLogin"])
    },
    methods: {
      addView() {
        let questionId = this.question.id
        axios.put(`${portUrl}/questions/views/${questionId}`)
        .then((result) => {
          console.log('success add view:', result)
        }).catch((err) => {
          console.log('FAIL add view:', err)
        });
      },
      getQuestions() {
        // console.log('get all questions')
        this.questions = []
        let self = this
        axios.get(`${portUrl}/questions`)
        .then((result) => {
          result.data.forEach(question=>{
            let summary = question.contents.slice(0,100)+'...'
            let data = {
              id: question._id,
              title : question.title,
              contents : summary,
              questioner : question.questioner,
              tags: question.tags,
              likes: question.userLikes.length,
              dislikes: question.userDislikes.length,
              views: question.views,
              date : question.createdAt || new Date
            }
            self.questions.push(data)
          })
          // console.log(result.data[0], 'questions---->', self.questions)
        }).catch((err) => {
          console.log('Sorry Error:', err)
        });
      },
      searchQuestion() {
        let self = this
        let arr = []
        if(this.query) {
          this.questions.forEach(question=>{
            if(question.title.toLowerCase().indexOf(this.query) !== -1) {
              arr.push(question)
            }
          })
          this.questions = arr
        } else {
          this.questions = []
          this.getQuestions()
        }
      },
      showMyQuestions() {
        let arr = []
        this.questions.forEach(question=>{
          if(question.questioner._id === localStorage.getItem('userId')) {
            arr.push(question)
          }
        })
        this.questions = arr
      },
      getReadCounter(id) {
        // console.log('id', id)
        this.showComments = false
      }
    },
    watch: {
      readCounter(val) {
        console.log('readcount---', val)
      }
    },
    created() {
      this.getQuestions()
      if(localStorage.getItem('token')) {
        // this.getIsLogin()
      }
    },
  }
</script>

<style >
  .side-bar {
    background-color: whitesmoke;
  }
  #read:hover{
    color: slateblue;
    background-color: whitesmoke;
    cursor: pointer;
  }
  .btn-sm:hover {
    cursor:pointer;
    transform:scale(1.3,1.3);
    -webkit-transform:scale(1.3,1.3);
    -moz-transform:scale(1.3,1.3);
  }
</style>