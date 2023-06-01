<template>
  <ModalDialog v-model:open="open" :option="option">
    <template #header>
      <h1 class="modal-title">ใบเสร็จรับเงิน</h1>
    </template>
    <template #body>
      <div style="padding: 20px">
        <ReceiptViewDetail :receipt-prop="props.receiptData" />
      </div>
    </template>
  </ModalDialog>
</template>

<script setup lang="ts">
import { ModalDialog } from '@/components/modal'
import { ref, type PropType } from 'vue'
import { ReceiptViewDetail } from '@/components/receiptView'
import type { ModalOption } from '@/interface/modal'
import type { ReceiptForm } from '@/interface/receipt'

const props = defineProps({
  receiptData: {
    type: Object as PropType<ReceiptForm>,
    required: true
  }
})

const open = ref(false)
function openModal() {
  open.value = true
}
const option = ref<ModalOption>({
  style: {
    width: '1200px',
    height: 'auto',
    'margin-top': '100px'
  }
})
defineExpose({ openModal })
</script>
