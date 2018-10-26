import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    username: '',
    userId: ''
  },
  mutations: {
    setIsLogin(state, payload) {
      state.isLogin = payload
    },
    setUsername(state, payload) {
      state.username = payload
      console.log('masuk store setUsername:::', state.username)
    },
    setUserId(state, payload) {
      state.userId = payload
    }
  },
  actions: {
    getIsLogin({commit, dispatch}, payload) {
      commit('setIsLogin', payload)
      if(localStorage.getItem('token')) {
        commit('setIsLogin', payload)
      } else {
        commit('setIsLogin', payload)
        this.$router.push('/login')
      }
    },
    getUsername({commit, dispatch}, payload) {
      console.log('masuk stor getusername:', payload)
      commit('setUsername', payload)
    },
    getUserId({commit, dispatch}, payload) {
      commit('setUserId', payload)
    }
  }
})
