<template>
  <div class="grid-table grid-table--content" @click="deletePayment">
    <span class="grid-table__span">{{payment.date}}</span>
    <span class="grid-table__span">{{payment.amountFormatted}}</span>
    <span class="grid-table__span">{{payment.days}}</span>
    <span class="grid-table__span">{{payment.e}}</span>
    <span class="grid-table__span">{{payment.q}}</span>
    <span class="grid-table__span">{{payment.den}}</span>
    <span class="grid-table__span">{{payment.denNext}}</span>
    <span class="grid-table__span">{{payment.denPrev}}</span>
  </div>
</template>

<script>
export default {
  props: ["payment"],
  methods: {
    deletePayment() {
      this.$store.dispatch('deletePayment', this.payment.index)
    }
  }
};
</script>

<style lang="scss">
</style>
