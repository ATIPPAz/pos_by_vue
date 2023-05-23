<template>
  <div class="card" @click="cardClick">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { type PropType, defineComponent } from 'vue'
export default defineComponent({
  props: {
    item: {
      type: Object as PropType<any>,
      required: true
    }
  },
  emits: {
    onClick(value: any) {
      return true
    }
  },
  setup(props, { emit }) {
    function cardClick() {
      emit('onClick', props.item)
    }
    return {
      cardClick
    }
  }
})
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
