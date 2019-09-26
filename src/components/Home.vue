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
      <app-payment
        v-for="payment in payments"
        :key="payments.indexOf(payment) + payment.den"
        :payment="payment"
        content="Нажмите для удаления"
        v-tippy="{arrow : true, arrowType : 'round', animation : 'fade',  placement : 'right'}"
      ></app-payment>
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
      <currency-input
        v-model="amount"
        v-currency="{currency: 'RUB', locale: 'ru', distractionFree: false}"
        placeholder="Сумма"
        class="input"
        @focus="clearInput"
      />
      <multiselect v-model="type" :options="options" placeholder="Тип платежа"></multiselect>
      <button class="btn" @click="addPayment" :class="{shake: error}">Добавить платёж</button>
    </div>
    <transition name="slide-fade">
      <app-error v-if="error">
        <span class="error__progress" :style="{width: (timer*20) + '%'}"></span>
      </app-error>
    </transition>
    <button v-print="'#printMe'" class="btn btn--print" :key="i">Распечатать</button>
  </div>
</template>

<script>
import Payment from "./Payment.vue";
import AppError from "./Error.vue";
import DatePicker from "vue2-datepicker";

export default {
  data() {
    return {
      date: null,
      type: null,
      amount: null,
      options: ["Выплата", "Оплата"],
      error: false,
      timer: 5
    };
  },
  components: {
    appPayment: Payment,
    appDatePicker: DatePicker,
    appError: AppError
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
    },
    i() {
      return this.$store.getters.i;
    },
    psk() {
      return this.$store.getters.psk;
    }
  },
  methods: {
    addPayment() {
      if (!this.validateForm()) {
        this.error = true;
        this.timer = 5;

        let interval = setInterval(() => {
          this.timer -= 0.1;
          if (this.timer < 0) {
            clearInterval(interval);
          }
        }, 100);

        setTimeout(() => {
          this.error = false;
        }, 5100);

        return;
      }
      this.error = false;
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
    validateForm() {
      return this.date != null && this.amount != null && this.type != null
        ? true
        : false;
    },
    clearInput() {
      this.amount = null;
    }
  }
};
</script>

<style lang="scss">
.home {
  position: relative;
}

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

  &--print {
    margin-top: 50px;
    padding: 10px 20px;
    background: #63b3ed;
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
  font-size: 14px;

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

.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.5s ease-out;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
    border: 1px solid #e53e3e;
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
    border: 1px solid #f56565;
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
    border: 1px solid #e53e3e;
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
    border: 1px solid #f56565;
  }
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
