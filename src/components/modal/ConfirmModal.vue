<template>
  <ModalDialog v-model:open="open" :option="option">
    <template #header>
      <h1 class="modal-title">ต้องการดำเนินการต่อหรือไม่?</h1>
    </template>
    <template #body> กด yes เพื่อตกลง หรือกด no เพื่อกดยกเลิก </template>
    <template #footer>
      <button @click="closeModal(false)" class="gray" style="margin-right: 8px">No</button>
      <button @click="closeModal(true)" class="blue">Yes</button>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ModalDialog } from '@/components/modal'
import { ref } from 'vue'
import type { ModalOption } from '@/interface/modal.js'
let res: ((value: boolean | PromiseLike<boolean>) => void) | null
const open = ref(false)
function getConfirmResult() {
  open.value = true
  return new Promise<boolean>((resolve) => {
    res = resolve
  })
}
const option = ref<ModalOption>({
  style: {
    width: '600px',
    height: '200px',
    'margin-top': '200px'
  }
})
function closeModal(result: boolean) {
  open.value = false
  if (res) {
    res(result)
    res = null
  }
}
defineExpose({ getConfirmResult })
</script>
