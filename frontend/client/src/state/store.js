import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);
export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user: null,
    token: null,
    widgets: {},
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {
  },
  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
    getToken(state) {
      return state.token;
    },
  },
});
