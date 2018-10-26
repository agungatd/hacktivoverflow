<template>
  <div class='main-content'>
  <br>
    <div style='text-align:left;'><small id='back' style='color:blue; ' @click='backToHome'>Back to list Questions</small></div>
    <h3 style='color: darkblue; border-bottom:1px solid darkblue;'>Question:</h3>
    <h3>{{ question.title }}</h3>
    <small>Asked by {{ question.questioner.username }}</small>
    <hr>
      <p>Posted on {{ getDate(question.createdAt) }}</p>
    <hr>
    <div class='paragraf' v-html="question.contents">
    </div><hr>
    <div class='tags'>
      <em>Tags: </em><span v-for='tag in question.tags'><button class='btn btn-small btn-primary' disabled>{{tag}}</button>&nbsp;</span>
    </div>
    <div v-if='activeId === question.questioner._id'><br><br>
      <button class='btn-sm btn-primary' data-toggle="modal" data-target="#editModal">Edit question</button> &nbsp; <button class='btn-sm btn-danger' data-toggle="modal" data-target="#deleteModal">Delete question</button>
    </div>
    <hr>
    <div class='row' id='icons'>
      <div class='col-sm-4'>
        <span style='color: red;' @click='addUpvote' v-if='!hasUpvoted'><i class="fa fa-thumbs-up">Upvote</i>  &nbsp;&nbsp;</span>
        <span style='color: grey; cursor:default; background-color:white; !important' v-if='hasUpvoted'><i class="fa fa-thumbs-up">Upvoted</i>  &nbsp;&nbsp;</span>
        <span  style='color: darkblue;' @click='addDownvote' v-if='!hasDownvoted'><i class="fa fa-thumbs-down" aria-hidden="true">Downvote</i> </span>
        <span style='color: grey; cursor:default; background-color:white; !important' v-if='hasDownvoted'><i class="fa fa-thumbs-down" aria-hidden="true">Downvoted</i> </span>
          <span></span>
      </div>
      <div class='col-sm-4'>
        <span style='color: blue;' @click='showShare'><i class="fa fa-share-alt" aria-hidden="true">Share</i> </span> 
      </div>
      <div class='col-sm-4'>
        Total vote: {{ question.userLikes.length - question.userDislikes.length }}
      </div>
    </div><br>
    <share v-if='shareOpen' :question='question' :user='question.questioner.username'></share>

    <div class='answers'>
      <h3>Answers:</h3>
      <hr>
      <textarea style='min-height:100px; min-width:700px' placeholder='Enter your answer here...' v-model='answer' /><br>
      <button @click='submitAnswer(question._id)'>Submit Answer</button>
      <button @click='showAnswerForm(question._id)'>Refresh Answer</button>
      <div v-for='answer in allAnswers' class='answerBox'>
        <div>posted on: {{ getDate(answer.createdAt) }}</div>
        <div style='text-align:left; padding-left:5px;'>{{ answer.user.username }} Answered:</div>
        <div style='text-align:right ; padding-right:5px;'>{{ answer.answer }}</div>
        <div>
          <span style='color: red;' @click='commentUpvote(answer._id)' v-if='!hasUpvotedAns'><i class="fa fa-thumbs-up">Upvote</i>  &nbsp;&nbsp;</span>
        <span style='color: grey; cursor:default; background-color:white; !important' v-if='hasUpvotedAns'><i class="fa fa-thumbs-up">Upvoted</i>  &nbsp;&nbsp;</span>
        <span  style='color: darkblue;' @click='commentDownvote(answer._id)' v-if='!hasDownvotedAns'><i class="fa fa-thumbs-down" aria-hidden="true">Downvote</i> </span>
        <span  style='color: grey; cursor:default; background-color:white; !important' v-if='hasDownvotedAns'><i class="fa fa-thumbs-down" aria-hidden="true">Downvoted</i> </span>
          <span style='text-align: right;'>&nbsp;Total vote: {{answer.userLike.length - answer.userDislike.length}}</span>
        </div>
      </div>
    </div>

    <!-- MODAL EDIT -->
      <div class="modal fade " id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Edit your question Here:</h5>
              
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                  <label for="title">Insert question Title:</label>
                  <input class="form-control" type="text" name="title" id="" placeholder='Input Title here..' v-model='question.title' required>
                </div>
                  <label for="contents">Insert question Contents:</label>
                    <wysiwyg v-model='question.contents'/>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click='editQuestion(question._id)' data-dismiss="modal">Edit</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    <!-- / MODAL EDIT -->
    <!-- MODAL Delete -->
      <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteModalLabel">Delete This question ?</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              {{question.questioner.username}}, are you sure ?
              Do you really want to delete this question ??
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-warning" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" @click='deleteQuestion(question._id)' data-dismiss="modal">Yes, Just Delete It!</button>
            </div>
          </div>
        </div>
      </div>
      <!-- / MODAL Delete -->
  </div>
</template>

<script>
  import share from '@/components/share.vue'
  import portUrl from '../../config.js'
  import {mapActions, mapState} from "vuex"

  export default {
    props: ['getDate'],
    components: {
      share
    },
    data() {
      return {
        question: '',
        activeId: localStorage.getItem('userId'),
        views: null,
        removeList: '',
        answer: '',
        allAnswers: [],
        shareOpen: false,
        showAnswer: false,
        hasUpvoted: false,
        hasDownvoted: false,
        hasDownvotedAns: false,
        hasUpvotedAns: false
      }
    },
    methods: {
      addUpvote() {
        this.hasUpvoted = true
        if(this.hasDownvoted) {
          this.hasDownvoted = false
          this.question.userDislikes.pull()
        }
        let self = this
        axios.put(`${portUrl}/questions/upvote/${questionId}`, {}, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((result) => {
          console.log('success upvote-->', result)
        }).catch((err) => {
          console.log('fail upvote-->', err)
        });
      },
      addDownvote() {
        this.hasDownvoted = true
        if(this.hasUpvoted) {
          this.hasUpvoted = false
          this.question.userLikes.pull()
        }
        let self = this
        axios.put(`${portUrl}/questions/downvote/${questionId}`, {}, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((result) => {
          console.log('success upvote-->', result)
        }).catch((err) => {
          console.log('fail upvote-->', err)
        });
      },
      commentUpvote(answerId) {
        this.hasUpvotedAns = true
        let userId = localStorage.getItem('userId')
        this.question.userLikes.push(userId)
        axios.put(`${portUrl}/answers/upvote/${answerId}`, {}, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((result) => {
          console.log('success upvote-->', result)
        }).catch((err) => {
          console.log('fail upvote-->', err)
        });
      },
      commentDownvote(answerId) {
        this.hasDownvotedAns = true
        let userId = localStorage.getItem('userId')
        this.question.userLikes.push(userId)
        axios.put(`${portUrl}/answers/downvote/${answerId}`, {}, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((result) => {
          console.log('success downvote-->', result)
        }).catch((err) => {
          console.log('fail downvote-->', err)
        });
      },
      backToHome() {
        this.$router.push({ path: `/` })
      },
      getQuestion(id) {
         console.log('get question--', id)
        let self = this
        axios.get(`${portUrl}/questions/${id}`)
        .then((result) => {
          self.question = result.data
          this.showAnswer = false
        }).catch((err) => {
          console.log(err)
        });
      },
      editQuestion(id) {
        console.log(this.question.userLikes, this.question.userDislikes)
        let self = this
        axios.put(`${portUrl}/questions/${id}`, {
          title: self.question.title,
          contents: self.question.contents,
          tags: self.question.tags,
          userLikes: self.question.userLikes,
          userDislikes: self.question.userDislikes,
          views: self.question.views
        }, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((result) => {
          console.log('success edit', result)
          self.getQuestion(id)
        }).catch((err) => {
          console.log(err)
        });
      },
      deleteQuestion(id) {
        console.log('masukkk kedelete...', id)
        let self = this
        axios.delete(`${portUrl}/questions/${id}`,{
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((result) => {
          self.getQuestion(id)
          this.$router.push({name:'home'})
          this.getQuestion()
        }).catch((err) => {
          console.log(err)
        });
      },
      showAnswerForm(id) {
        this.showGlobalChat = false
        this.showAnswer = true
        this.showAllAnswer(id)
      },
      showAllAnswer(id) {
        self = this
        axios.get(`${portUrl}/answers/${id}`)
        .then((result) => {
          self.allAnswers = result.data
        }).catch((err) => {
          console.log(err)
        });
      },
      submitAnswer(id) {
        // console.log('ID nya question:', id, this.answer)
        let self = this
        axios.post(`${portUrl}/answers`, {
          user: localStorage.getItem('userId'),
          answer: self.answer,
          question: id
        }, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((result) => {
          // console.log('hasil dari submit answer--',result.data)
          self.showAllAnswer(id)
          self.answer=''
        }).catch((err) => {
          console.log(err)
        });
      },
      showShare() {
        if(this.shareOpen) {
          this.shareOpen = false
        } else {
        this.shareOpen = true
        }
      },
      populateAnswerToQuestion(answerId) {
        let self = this
        axios.put(`${portUrl}/questions/${this.$router.history.current.params.id}`, {
          
        }, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      }
    },
    mounted() {
      
    },
    created() {
      this.getQuestion(this.$router.history.current.params.id)
      this.showAllAnswer(this.$router.history.current.params.id)
      this.showAnswer = false
    },
    computed: {
      getParamsId: function() {
        return this.$route.params.id
      },
      ...mapState(["isLogin"])
    },
    watch: {
      getParamsId: function(val) {
        this.getQuestion(val)
      },
      question: function(val) {
        // console.log(val)
      },
      showAnswer: function(val) {
        console.log('status showanswer-->', val)
      }
    }
  }
</script>

<style >
.main-content {
  background-color: white;
  padding: 20px;
  border-radius: 5%;
}
#image {
  min-height: 400px;
  width: 100%;
}
.paragraf {
  text-align: justify;
  text-justify: inter-word;
  width: 100%
}
span i:hover{
  cursor: pointer;
  background-color: lightgrey;
}
.answerBox {
  border: 1px solid brown;
  margin: 5px auto;
  min-width:700px;
  background-color: #e6e6fa;
}
#back:hover {
  cursor:pointer;
  border-bottom: 1px solid blue;
}
.tags {
  text-align: left;
  cursor: default;
}
.deactivated:hover{
  background-color: white;
  cursor:default;
}

</style>