<template>
  <ModelDialog :open="open" :option="option">
    <template #header>
      <span class="close" @click="closeModel(false)"> &times; </span>
      <h1 class="modal-title">ต้องการดำเนินการต่อหรือไม่?</h1>
    </template>
    <template #body> กด yes เพื่อตกลง หรือกด no เพื่อกดยกเลิก </template>
    <template #footer>
      <button @click="closeModel(false)" class="gray" style="margin-right: 8px">No</button>
      <button @click="closeModel(true)" class="blue">Yes</button>
    </template>
  </ModelDialog>
</template>

<script lang="ts">
import ModelDialog from '@/components/modal/ModalDialog.vue'
import { defineComponent, ref } from 'vue'
import type { ModalOption } from '@/interface/modal.interface'

export default defineComponent({
  components: { ModelDialog },
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    let res: any = null
    function getConfirmResult() {
      return new Promise((resolve) => {
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
    function closeModel(result: boolean) {
      res(result)
    }
    return {
      getConfirmResult,
      closeModel,
      option
    }
  }
})
</script>
