<template>
  <div class="home">
   <!-- Page Header -->
    
     <!-- 
      <h6 v-if='isLogin'>Bitcoin Price Index</h6>
      {{info.data.bpi.USD.code}} : {{info.data.bpi.USD.rate}}
      -->

    <div class="row">
      <div class="side-bar col-md-12">
        <SideBar :isLogin='isLogin' :getDate='getDate' ></SideBar>
      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import SideBar from "@/components/sideBar.vue";
import {mapActions, mapState} from "vuex"

export default {
  props: ['getDate'],
  name: 'home',
  data () {
    return {
      info: null
    }
  },
  mounted () {
    
  },
  components: { 
    SideBar
  },
  methods: {
    
  },
  watch: {
   
  },
  computed: {
    ...mapState(["isLogin"])
  }
}
</script>

<style>

.masthead {
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: 50% 20%; 
  background-size: cover;
}

.site-heading {
  color: whitesmoke;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}

</style>
