import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    payments: [],
    bp: 30
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
      state.payments.sort((a, b) => a.dateComputed - b.dateComputed)
      state.payments.forEach(el => {
        if (state.payments.indexOf(el) > 0 && el.type !== "Выплата") {
          const prevEl = state.payments[state.payments.indexOf(el) - 1];
          const firstEl = state.payments[0];
          el.days =
            (Date.parse(el.dateComputed) - Date.parse(prevEl.dateComputed)) /
            (60 * 60 * 24 * 1000);
          let daysTotal =
            (Date.parse(el.dateComputed) - Date.parse(firstEl.dateComputed)) /
            (60 * 60 * 24 * 1000);
          el.e = ((daysTotal % state.bp) / state.bp).toFixed(10);
          el.q = Math.floor(daysTotal / state.bp);
        } else {
          el.e = 0;
          el.q = 0;
        }
      });
    },
    'UPDATE_PAYMENTS'(state, payments) {
      state.payments = payments;
    },
    'DELETE_PAYMENT'(state, payment) {
      state.payments.splice(state.payments.indexOf(payment), 1);
    }
  },
  actions: {
    addPayment({commit}, payload) {
      commit('ADD_PAYMENT', payload)
    },
    updatePayments({commit}, payload) {
      commit('UPDATE_PAYMENTS', payload)
    },
    deletePayment({ commit }, payload) {
      commit('DELETE_PAYMENT', payload)
    }
  },
  getters: {
    payments(state) {
      return state.payments;
    },
    bp(state) {
      return state.bp;
    }
  }
})
