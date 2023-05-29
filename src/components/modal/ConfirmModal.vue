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

<script lang="ts">
import ModalDialog from '@/components/modal/ModalDialog.vue'
import { defineComponent, ref } from 'vue'
import type { ModalOption } from '@/interface/modal.js'
import { computed } from 'vue'

export default defineComponent({
  components: { ModalDialog },
  // props: {
  //   open: {
  //     type: Boolean,
  //     required: true
  //   }
  // },
  // emits: {
  //   'update:open'(value: boolean) {
  //     return true
  //   }
  // },
  setup(props, { emit }) {
    let res: (value: boolean | PromiseLike<boolean>) => void
    const open = ref(false)
    // const openLocal = computed({
    //   get() {
    //     return props.open
    //   },
    //   set(value) {
    //     emit('update:open', value)
    //   }
    // })
    function getConfirmResult() {
      // openLocal.value = true
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
      res(result)
    }
    return {
      getConfirmResult,
      closeModal,
      open,
      option
    }
  }
})
</script>
