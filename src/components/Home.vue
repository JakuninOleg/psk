<template>
  <div class="home">
    <div id="printMe">
      <div class="heading-container">
        <h1 class="heading-primary">Справка-расчёт полной стоимости займа (ПСК)</h1>
      </div>
      <div class="grid-table grid-table--top">
        <span class="psk grid-table__span grid-table__span--top">ПСК</span>
        <span class="psk-result grid-table__span grid-table__span--top">{{psk}}</span>
        <span class="bp grid-table__span grid-table__span--top">Расчётый % в базовый период</span>
        <span class="bp-percent grid-table__span grid-table__span--top">{{i}}</span>
      </div>

      <div class="grid-table">
        <span class="grid-table__span">Дата</span>
        <span class="grid-table__span">Сумма</span>
        <span class="grid-table__span">Дней с последней оплаты</span>
        <span class="grid-table__span">Ek</span>
        <span class="grid-table__span">Qk</span>
        <span class="grid-table__span">Знаменатель</span>
        <span class="grid-table__span">Знаменатель +</span>
        <span class="grid-table__span">Знаменатель -</span>
      </div>
      <app-payment v-for="payment in payments" :key="payment.den" :payment="payment"></app-payment>
    </div>
    <div class="form-grid">
      <app-datePicker
        lang="ru"
        v-model="date"
        value-type="date"
        format="DD.MM.YY"
        width="100%"
        input-class="input"
      ></app-datePicker>
      <input
        type="number"
        v-model.number="amount"
        placeholder="Сумма"
        class="input"
        @focus="clearInput"
      />
      <multiselect v-model="type" :options="options" placeholder="Тип платежа"></multiselect>
      <button class="btn" @click="addPayment">Добавить платёж</button>
    </div>
    <button v-print="'#printMe'" class="btn btn--print" :key="i">Распечатать</button>
  </div>
</template>

<script>
import payment from "./Payment.vue";
import DatePicker from "vue2-datepicker";
import { required, minValue } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      date: null,
      type: null,
      amount: null,
      options: ["Выплата", "Оплата"],
      cbp: 12.1666666667,
      i: 0,
      psk: 0,
      error: null
    };
  },
  validations: {
    amount: {
      required,
      minValue: minValue(0)
    }
  },
  components: {
    appPayment: payment,
    appDatePicker: DatePicker
  },
  computed: {
    payments() {
      return this.$store.getters.payments;
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
    bp() {
      return this.$store.getters.bp;
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
      this.findPSK();
    },
    findPSK() {
      const payments = this.$store.getters.payments;

      if (!payments.some(el => el.amount < 0)) {
        [this.psk, this.i] = ["Добавьте выплату", "Добавьте выплату"];
        return;
      }

      let i = 0;
      let x = 1;
      let x_m = 0;
      let s = 0.001;

      while (x > 0) {
        x_m = x;
        x = 0;
        payments.forEach(el => {
          let den = (1 + el.e * i) * Math.pow(1 + i, el.q);
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

      this.$store.dispatch("updatePayments", payments);
      this.psk = Math.floor(i * this.cbp * 100).toFixed(3) + "%";
      this.i = (i * 100).toFixed(3) + "%";
    },
    validateForm() {},
    clearInput() {
      this.amount = "";
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

.input {
  padding: 5px 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  color: black;
  width: 100%;
  height: 40px;
}

.input::placeholder,
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
  grid-template-columns: repeat(3, 300px) 200px;
  grid-gap: 20px;
  width: 67%;
  padding-top: 80px;
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

  &--delete {
    background: #e53e3e;
  }

  &--print {
    margin-top: 50px;
    padding: 10px 20px;
  }

  &:active {
    transform: translateY(1px);
  }
}

.grid-table {
  width: 1350px;
  display: grid;
  grid-template-columns: 150px 250px 250px 175px 75px 150px 150px 150px;
  text-align: center;
  font-weight: 500;

  &--content {
    text-align: right;
    font-weight: 400;

    &:hover {
      cursor: pointer;
      background: #fed7d7;
    }
  }

  &--top {
    grid-template-columns: repeat(2, 200px);
    grid-template-rows: repeat(2, 45px);
    width: 200px;
    margin-bottom: 50px;
    grid-template-rows: 80px 55px;
  }

  &__span {
    border: 1px solid black !important;
    padding: 4px 6px;
    display: grid;
    align-items: center;
    border-collapse: collapse;
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
