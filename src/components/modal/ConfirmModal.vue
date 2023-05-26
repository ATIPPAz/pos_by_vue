<template>
  <ModelDialog :open="openModel">
    <template #header>
      <span class="close" @click="closeModel(false)"> &times; </span>
      <h1 class="modal-title">ต้องการดำเนินการต่อหรือไม่</h1>
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

export default defineComponent({
  components: { ModelDialog },
  setup() {
    const openModel = ref(false)
    let res: any = null
    function openConfirmModal() {
      openModel.value = true
      return new Promise((resolve) => {
        res = resolve
      })
    }
    function closeModel(result: boolean) {
      res(result)
    }
    return {
      openModel,
      openConfirmModal,
      closeModel
    }
  }
})
</script>
