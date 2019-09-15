<template>
  <div class="grid-table grid-table--content">
    <span
      class="grid-table__span"
      :class="payment.type == 'Выплата' ? 'red' : 'green'"
    >{{payment.date}}</span>
    <span
      class="grid-table__span"
      :class="payment.type == 'Выплата' ? 'red' : 'green'"
    >{{payment.amountFormatted}}</span>
    <span
      class="grid-table__span"
      :class="payment.type == 'Выплата' ? 'red' : 'green'"
    >{{payment.days}}</span>
    <span
      class="grid-table__span"
      :class="payment.type == 'Выплата' ? 'red' : 'green'"
    >{{payment.e}}</span>
    <span
      class="grid-table__span"
      :class="payment.type == 'Выплата' ? 'red' : 'green'"
    >{{payment.q}}</span>
  </div>
</template>

<script>
export default {
  props: ["payment"]
};
</script>

<style lang="scss">
  .red {
    background: #FED7D7;
  }

  .green {
    background: #c6f6d5;
  }
</style>
