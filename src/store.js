import Vue from 'vue'
import Vuex from 'vuex'

// const nr = require('newton-raphson-method');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    payments: [],
    bp: 30,
    psk: 'Добавьте выплату',
    i: 'Добавьте выплату',
    cbp: 12.1666666667
  },
  mutations: {
    'ADD_PAYMENT'(state, payment) {
      state.payments.push(payment)
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
    'FIND_PSK'(state, results) {
      state.psk = results[0];
      state.i = results[1];
    },
    'DELETE_PAYMENT'(state, payment) {
      state.payments.splice(state.payments.indexOf(payment), 1);
    }
  },
  actions: {
    addPayment({commit, dispatch}, payload) {
      commit('ADD_PAYMENT', payload)
      setTimeout(() => {
        dispatch('findPsk')
      }, 0);
    },
    deletePayment({ commit, dispatch }, payload) {
      commit('DELETE_PAYMENT', payload)
      setTimeout(() => {
        dispatch('findPsk')
      }, 0);
    },
    findPsk({state, commit}) {
      const payments = state.payments;

      if (payments.length < 1 || payments[0].amount > 0) {
        return [state.psk, state.i] = ["Добавьте выплату", "Добавьте выплату"];
      } else if (payments.length == 1) {
        return [state.psk, state.i] = ["Добавьте оплату", "Добавьте оплату"];
      }

      let i = 0;
      let x = 1;
      let x_m = 0;
      let s = 0.000001;

      while (x > 0) {
        x_m = x;
        x = 0;
        payments.forEach(el => {
          let den = ((1 + el.e * i) * Math.pow(1 + i, el.q));
          x = x + el.amount / den;
          el.den = den.toFixed(9);
          el.denPrev = (
            (1 + el.e * (i - s)) *
            Math.pow(1 + (i - s), el.q)
          ).toFixed(9);
          el.denNext = (
            (1 + el.e * (i + s)) *
            Math.pow(1 + (i + s), el.q)
          ).toFixed(9);
        });
        i = i + s;
      }

      x > x_m ? (i = i - s) : "";
      const psk = (i * state.cbp * 100).toFixed(3) + "%";
      i = (i * 100).toFixed(3) + "%";

      const data = [psk, i];

      commit('FIND_PSK', data);
    }
  },
  getters: {
    payments(state) {
      return state.payments;
    },
    bp(state) {
      return state.bp;
    },
    cbp(state) {
      return state.cbp;
    },
    i(state) {
      return state.i;
    },
    psk(state) {
      return state.psk;
    }
  }
})
