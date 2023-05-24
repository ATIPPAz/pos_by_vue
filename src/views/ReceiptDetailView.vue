<template>
  <ReceiptDetail :data="{}" title="" :is-view="true" />
</template>

<script lang="ts">
import ReceiptDetail from '@/components/receipt/receiptManager.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    ReceiptDetail
  },
  setup() {
    return {}
  }
})
</script>
