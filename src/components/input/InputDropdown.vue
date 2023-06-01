<template>
  <select v-model="optionSelect">
    <option v-for="option in options" :value="option.id" :key="option.id">
      {{ option.label }}
    </option>
  </select>
</template>
<script setup lang="ts">
import type { Option } from '@/interface/dropdown'
import { computed, type PropType } from 'vue'

const props = defineProps({
  options: {
    type: Array as PropType<Option[]>,
    required: true
  },
  modelValue: {
    type: Object as PropType<any>
  }
})
const emit = defineEmits({
  'update:modelValue'(value: any) {
    return true
  }
})

const optionSelect = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
