<template>
  <div id="app">
  <!-- NAVBAR -->
  <div class='col'>
     <nav class="navbar navbar-expand-lg fixed-top" id="nav">
      <div class="container-fluid right">
        <a class="navbar-brand"><span style='color:brown'>Hacktiv</span>-Overflow</a>
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span style='color:white;'>Menu</span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <span> <router-link to="/">Home</router-link> &nbsp;|&nbsp; </span>
          <span v-if='!isLogin'> <router-link to="/login" >Login</router-link> &nbsp;|&nbsp; </span>
          <span v-if='isLogin'> <router-link to="/question">Ask Question</router-link> &nbsp;|&nbsp; </span>
          <span v-if='isLogin'> <router-link to="/profile">Profile</router-link> </span>
        </div>
      </div>
      <div >
        <h5 v-if='isLogin'>Hi, {{username}}. Welcome Back!</h5>
      </div>
      <div >
        <button class='logout btn btn-sm' v-if='isLogin' @click='logout'>Logout</button>
      </div>
    </nav>
  </div>
  <div class='container'>
     <router-view :hasLoggedIn='hasLoggedIn' :isLogin='isLogin' :userId='userId' :getDate='getDate' :showComments='showComments' />
  </div>
    
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

 export default {
  name: 'app',
  data(){
    return{
      showComments: false
    }    
  },
  components: {
  },
  computed: {
    ...mapState(["isLogin", "username", "userId"])
  },
  methods: {
    ...mapActions(["getIsLogin", "getUsername", "getUserId"]),
     logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('userId')
      this.getIsLogin(false)
      this.getUserId('')
      this.getUsername('')
      this.signOut()
    },
    signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      })
    },
    getDate(isoDate) {
      let date = new Date(isoDate);
      return date.getDate()+'-' + (date.getMonth()+1) + '-'+date.getFullYear();
    }

  },
  created() {
    if(localStorage.getItem('token')) {
      this.getIsLogin(true)
      this.getUsername(localStorage.getItem('username'))
      this.getUserId(localStorage.getItem('userId'))
    }
  }
};
</script>
<style>
* {
  padding: 0;
  margin: 0;
}
    #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: url('https://images.pexels.com/photos/1452701/pexels-photo-1452701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940');
  background-size: cover;
}
.container {
  padding-top: 125px;
  padding-bottom: 50px;
}
#nav {
  padding: 10px;
  background-color: #c6e2ff;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: green;
}
.navbar-toggler {
  background-color: black;
  color: white;
}
#mainNav {
  position: absolute;
  border-bottom: 1px solid #e9ecef;
  background-color: white;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

#mainNav .navbar-brand {
  font-weight: 800;
  color: #343a40;
}

#mainNav .navbar-toggler {
  font-size: 12px;
  font-weight: 800;
  padding: 13px;
  text-transform: uppercase;
  color: #343a40;
}

#mainNav .navbar-nav > li.nav-item > a {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.logout:hover {
  background-color: black;
  color: white;
  padding-left: 10px;
}

@media only screen {
  #mainNav {
    border-bottom: 1px solid transparent;
    background: transparent;
  }
  #mainNav .navbar-brand {
    padding: 10px 20px;
    color: #fff;
  }
  #mainNav .navbar-brand:focus, #mainNav .navbar-brand:hover {
    color: rgba(255, 255, 255, 0.8);
  }
  #mainNav .navbar-nav > li.nav-item > a {
    padding: 10px 20px;
    color: #fff;
  }
  #mainNav .navbar-nav > li.nav-item > a:focus, #mainNav .navbar-nav > li.nav-item > a:hover {
    color: rgba(255, 255, 255, 0.8);
  }
}

@media only screen and (min-width: 992px) {
  #mainNav {
    -webkit-transition: background-color 0.2s;
    transition: background-color 0.2s;
    /* Force Hardware Acceleration in WebKit */
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
  }
  #mainNav.is-fixed {
    /* when the user scrolls down, we hide the header right above the viewport */
    position: fixed;
    top: -67px;
    -webkit-transition: -webkit-transform 0.2s;
    transition: -webkit-transform 0.2s;
    transition: transform 0.2s;
    transition: transform 0.2s, -webkit-transform 0.2s;
    border-bottom: 1px solid white;
    background-color: rgba(255, 255, 255, 0.9);
  }
  #mainNav.is-fixed .navbar-brand {
    color: #212529;
  }
  #mainNav.is-fixed .navbar-brand:focus, #mainNav.is-fixed .navbar-brand:hover {
    color: #0085A1;
  }
  #mainNav.is-fixed .navbar-nav > li.nav-item > a {
    color: #212529;
  }
  #mainNav.is-fixed .navbar-nav > li.nav-item > a:focus, #mainNav.is-fixed .navbar-nav > li.nav-item > a:hover {
    color: #0085A1;
  }
  #mainNav.is-visible {
    /* if the user changes the scrolling direction, we show the header */
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
</style>
