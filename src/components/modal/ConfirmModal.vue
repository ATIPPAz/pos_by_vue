<template>
  <ModelDialog v-model:open="openLocal" :option="option">
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
import { computed } from 'vue'

export default defineComponent({
  components: { ModelDialog },
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  emits: {
    'update:open'(value: boolean) {
      return true
    }
  },
  setup(props, { emit }) {
    let res: any = null
    const openLocal = computed({
      get() {
        return props.open
      },
      set(value) {
        emit('update:open', value)
      }
    })
    function getConfirmResult() {
      openLocal.value = true
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
      openLocal.value = false
      res(result)
    }
    return {
      getConfirmResult,
      closeModel,
      openLocal,
      option
    }
  }
})
</script>
