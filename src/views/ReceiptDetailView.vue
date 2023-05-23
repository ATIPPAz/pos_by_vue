<template>
  <ReceiptDetail :data="{}" title="" :is-view="true" />
</template>
<script lang="ts">
import ReceiptDetail from '@/components/receipt/receiptManager.vue'
export default {
  components: {
    ReceiptDetail
  },
  setup() {
    return {}
  }
}
</script>
