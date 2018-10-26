<template>
  <div id='ask'>
     <div class="alert alert-success" role="alert" v-if='success'>
        {{ msg }}
      </div>
      <div class="alert alert-danger" role="alert" v-if='error'>
        {{ msg }}
      </div>
    <div class="form-group">
      <label for="title">Insert Your Question <small>( start with 5W1H ):</small></label>
      <input class="form-control" type="text" name="title" id="" placeholder='Input your question here..' v-model='title' required>
    </div>
     <div class="form-group">
      <label for="contents">Insert Question Further Explanation or Description:</label>
        <wysiwyg v-model='contents'/>
    </div>
      <label for="tags">Insert Question Tags:</label>
    <div class="form-group" style='text-align:center'>
      <vue-tags-input
        v-model="tag"
        :tags="tags"
        @tags-changed="newTags => tags = newTags"
       style='display: inline-block' required/>
    </div>
       <!-- <textarea class="form-control" id="exampleFormControlTextarea1" name='contents' rows="5" v-model='contents'></textarea>-->
      
      <button class='btn btn-primary' @click='createQuestion'>Post Your Question</button>
    
  </div>
</template>

<script>
import portUrl from '../../config.js'
import VueTagsInput from '@johmun/vue-tags-input'
import {mapActions, mapState} from "vuex"

export default {
  name: 'createQuestion',
  components: {
    VueTagsInput,
  },
  data () {
    return {
      title: '',
      contents: '',
      msg: '',
      success: false,
      error: false,
      selectedFile: null,
      tag: '',
      tags: ['example','example2'],
    }
  },
  methods: {
    neutralize(){
      this.msg = '',
      this.error = false,
      this.success = false
    },
     clearState() {
      this.title= '',
      this.contents= '',
      this.tags= ['example','example2']
    },
    createQuestion() {
      this.neutralize()
      let self = this
      let token = localStorage.getItem('token')
      let userId = localStorage.getItem('userId')
      let arr = []
      self.tags.forEach(tag=>{
        if(tag.text) {
          arr.push(tag.text)
        } else {
          arr.push(tag)
        }
      })
      let data = {
        questioner: userId,
        title: self.title,
        contents: self.contents,
        tags: arr
      }
      console.log('create question--',data)
      axios.post(`${portUrl}/questions`, data, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .then((result) => {
        console.log(result)
        self.success = true,
        self.msg = 'Success created new Question'
        this.clearState()
      }).catch((err) => {
        console.log('ERROR:', err)
        self.error = true
        self.msg = err.response.data.message || 'internal server error!'
      });
    }
    
  },
  computed: {
    ...mapState(["isLogin"])
  }
}
</script>

<style scoped>
  * {
    background-color: white;
    padding: 10px;
  }
  .btn {
    color: black;
  }
  .btn:hover {
    color: white;
  }
</style>