<template>
  <div class="home">
    <div id="printMe">
      <div class="heading-container">
        <h1 class="heading-primary">Справка расчёт полной стоимости займа (ПСК)</h1>
      </div>
      <div class="grid-table grid-table--top">
        <span class="psk grid-table__span grid-table__span--top">ПСК</span>
        <span class="psk-result grid-table__span grid-table__span--top">{{findPSK[0]}}</span>
        <span class="bp grid-table__span grid-table__span--top">Расчётый % в базовый период</span>
        <span class="bp-percent grid-table__span grid-table__span--top">{{findPSK[1]}}</span>
      </div>

      <div class="grid-table">
        <span class="grid-table__span">Дата</span>
        <span class="grid-table__span">Сумма</span>
        <span class="grid-table__span">Дней с последней оплаты</span>
        <span class="grid-table__span">Ek</span>
        <span class="grid-table__span">Qk</span>
      </div>
      <app-payment v-for="payment in payments" :key="payment.index" :payment="payment"></app-payment>
    </div>
    <div class="form-grid">
      <app-datePicker lang="ru" v-model="date" value-type="date" format="DD.MM.YY"></app-datePicker>
      <input type="number" v-model.number="amount" placeholder="Сумма" />
      <multiselect v-model="type" :options="options" placeholder="Тип платежа"></multiselect>
      <button class="btn" @click="addPayment">Добавить платёж</button>
    </div>
    <button v-print="'#printMe'" class="btn btn--print">Распечатать</button>
  </div>
</template>

<script>
import payment from "./Payment.vue";
import DatePicker from "vue2-datepicker";

export default {
  data() {
    return {
      date: null,
      type: null,
      amount: null,
      options: ["Выплата", "Оплата"],
      bp: 30,
      cbp: 12.1666666667,
      i: null,
      printObj: {
        extraCss: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
      }
    };
  },
  components: {
    appPayment: payment,
    appDatePicker: DatePicker
  },
  computed: {
    payments() {
      const payments = this.$store.getters.payments;
      payments.sort((a, b) => {
        return a.dateComputed - b.dateComputed;
      });
      payments.forEach(el => {
        if (payments.indexOf(el) > 0) {
          const prevEl = payments[payments.indexOf(el) - 1];
          const firstEl = payments[0];
          el.days =
            (Date.parse(el.dateComputed) - Date.parse(prevEl.dateComputed)) /
            (60 * 60 * 24 * 1000);
          el.daysTotal =
            (Date.parse(el.dateComputed) - Date.parse(firstEl.dateComputed)) /
            (60 * 60 * 24 * 1000);
          el.e = (el.daysTotal % this.bp) / this.bp;
          el.q = Math.floor(el.daysTotal / this.bp);
        } else {
          el.e = 0;
          el.q = 0;
        }
      });
      return payments;
    },
    amountCalc() {
      return this.type == "Выплата" ? 0 - this.amount : this.amount;
    },
    amountFormatted() {
      let formatAmount = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB"
      }).format(this.amount);
      return this.amountCalc < 0 ? "- " + formatAmount : formatAmount;
    },
    findPSK() {
      let i = 0;
      let x = 1;
      let x_m = 0;
      let s = 0.0001;
      let m = this.$store.getters.payments.length;
      let sumArr = this.$store.getters.payments.map(el => el.amount);
      let eArr = this.$store.getters.payments.map(el => el.e);
      let qArr = this.$store.getters.payments.map(el => el.q);
      while (x > 0) {
        x_m = x;
        x = 0;
        for (let k = 0; k < m; k++) {
          x = x + sumArr[k] / ((1 + eArr[k] * i) * Math.pow(1 + i, qArr[k]));
        }
        i = i + s;
      }
      if (x > x_m) {
        i = i - s;
      }
      return [
        (Math.floor(i * this.cbp * 100 * 1000) / 1000).toFixed(3) + "%",
        (i * 100).toFixed(3) + "%"
      ];
    }
  },
  methods: {
    addPayment() {
      const payment = {
        date: this.date.toLocaleString("ru-RU", {
          day: "numeric",
          year: "numeric",
          month: "numeric"
        }),
        dateComputed: this.date,
        type: this.type,
        amount: this.amountCalc,
        amountFormatted: this.amountFormatted
      };
      this.$store.dispatch("addPayment", payment);
    },
    print() {
      this.$htmlToPaper("printMe");
    }
  }
};
</script>

<style lang="scss">
.heading-container {
  padding-bottom: 50px;
}

.heading-primary {
  font-size: 26px;
}

input,
.mx-input {
  padding: 5px 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  color: black;
}

.mx-datepicker {
  width: 100%;
}

.mx-input {
  height: 40px;
}

input::placeholder,
.multiselect__placeholder {
  color: #adadad;
  font-size: 14px;
  font-family: "Sans-serif";
}

.multiselect__placeholder {
  padding-top: 5px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(min-content, 1fr));
  grid-gap: 20px;
  width: 80%;
  padding-top: 100px;
}

.btn {
  border: 0.5px solid #cbd5e0;
  border-radius: 5px;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  background: #68d391;
  font-family: inherit;

  &--print {
    margin-top: 50px;
    padding: 10px 20px;
  }

  &:active {
    transform: translateY(1px);
  }
}

.grid-table {
  width: 80%;
  display: grid;
  grid-template-columns: 100px 300px 300px 150px 150px;
  border-left: 1px solid black;
  text-align: center;
  font-weight: 500;

  &--content {
    text-align: right;
    font-weight: 400;
  }

  &--top {
    grid-template-columns: repeat(2, 200px);
    grid-template-rows: repeat(2, 45px);
    width: 200px;
    margin-bottom: 50px;
    grid-template-rows: 80px 55px;
  }

  &__span {
    border: 1px solid black;
    border-left: none;
    padding: 4px 6px;
    display: grid;
    align-items: center;
  }
}

.psk,
.psk-result {
  font-size: 24px;
}

.bp,
.psk {
  text-align: left;
}

.home {
  padding: 50px;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
