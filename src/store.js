import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    payments: []
  },
  mutations: {
    'ADD_PAYMENT'(state, {type, date, amount, dateComputed, amountFormatted}) {
      state.payments.push({
        type,
        date,
        amount,
        dateComputed,
        amountFormatted
      })
    }
  },
  actions: {
    addPayment({commit}, payment) {
      commit('ADD_PAYMENT', payment)
    }
  },
  getters: {
    payments(state) {
      return state.payments;
    }
  }
})
