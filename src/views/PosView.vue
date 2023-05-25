<template>
  <MainFrame @click:backBtn="$router.push({ name: 'home' })">
    <template #title> <h1>ดูใบเสร็จรับเงิน</h1> </template>
    <template #content>
      <ReceiptDetail :is-view="false" />
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
  }
})
</script>
