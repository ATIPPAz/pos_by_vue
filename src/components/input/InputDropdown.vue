<template>
  <select v-model="optionSelect">
    <option v-for="option in options" :value="option.id" :key="option.id">
      {{ option.label }}
    </option>
  </select>
</template>
<script lang="ts">
import type { Option } from '@/interface/dropdown'
import { defineComponent, computed, type PropType } from 'vue'
export default defineComponent({
  props: {
    options: {
      type: Array as PropType<Option[]>,
      required: true
    },
    modelValue: {}
  },
  emits: {
    'update:modelValue'(value: any) {
      return true
    }
  },
  setup(props, { emit }) {
    const optionSelect = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    return { optionSelect }
  }
})
</script>
