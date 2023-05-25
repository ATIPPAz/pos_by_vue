<template>
  <MainFrame @click:backBtn="$router.push({ name: 'receipt' })">
    <template #content>
      <ReceiptDetail :is-view="true" />
    </template>
  </MainFrame>
</template>

<script lang="ts">
import ReceiptDetail from '@/components/receipt/receiptManager.vue'
import MainFrame from '@/components/mainFrame/MainFrame.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    ReceiptDetail,
    MainFrame
  },
  setup() {
    return {}
  }
})
</script>
