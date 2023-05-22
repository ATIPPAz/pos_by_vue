<template>
  <div class="card" @click="cardClick">
    <slot></slot>
  </div>
</template>
<script lang="ts">
export default {
  props: ['item'],
  setup(props, { emit }) {
    function cardClick() {
      emit('onClick', props.item)
    }
    return {
      cardClick
    }
  }
}
</script>
<style>
.card {
  border-radius: 8px;
  border: 1px solid #d2d2d2;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  padding: 24px;
  color: black;
  cursor: pointer;
  font-size: 16px;
}
</style>
