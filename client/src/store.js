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
    },
    setUserId(state, payload) {
      state.userId = payload
    }
  },
  actions: {
    getIsLogin({commit, dispatch}, payload) {
      commit('setIsLogin', true)
      if(localStorage.getItem('token')) {
        commit('setIsLogin', true)
      }
    },
    getUsername({commit, dispatch}, payload) {
      commit('setUsername', localStorage.getItem('username'))
    },
    getUserId({commit, dispatch}, payload) {
      commit('setUserId', localStorage.getItem('userId'))
    }
  }
})
