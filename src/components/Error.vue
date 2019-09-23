<template>
  <div class="error">
    <span class="error__message">Заполните все поля для создания платежа</span>
    <span class="error__progress--empty"></span>
    <slot></slot>
  </div>
</template>

<style lang="scss">
.error {
  position: absolute;
  top: 25px;
  right: 30px;
  width: 250px;
  height: 100px;
  display: grid;
  align-items: center;
  text-align: center;
  background: #f6e05e;
  border-radius: 5px;
  border: 1px solid #e2e8f0;
  grid-template-rows: 1fr [progress-start] 5px [progress-end];
  grid-template-columns: 1fr;

  &__message {
    padding: 10px;
  }

  &__progress {
    grid-row: progress-start / progress-end;
    grid-column: 1 / -1;
    background: #2f855a;
    height: 100%;
    transition: all .2s ease-out;

    &--empty {
      grid-row: progress-start / progress-end;
      grid-column: 1 / -1;
      background: #c6f6d5;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
