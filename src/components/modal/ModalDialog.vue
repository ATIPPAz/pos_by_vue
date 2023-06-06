<template>
  <div class="modal" v-if="open" style="padding-top: 20px">
    <div class="modal-content" :style="style">
      <div class="center">
        <div class="modal-header">
          <slot name="header">
            <p class="modal-title">modal</p>
          </slot>
          <span class="close" style="font-size: 24px" @click="emit('update:open', false)">
            &times;
          </span>
        </div>
      </div>
      <div class="modal-body">
        <slot name="body"> you can add your slot for custom your modal here !!!</slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button @click="emit('update:open', false)" class="gray" style="margin-right: 8px">
            close
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ModalOption } from '@/interface/modal'
const props = defineProps<{
  open: boolean
  option?: ModalOption
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
const style = computed(() => {
  return props.option?.style ? { ...props.option.style } : { width: '400px' }
})
</script>

<style>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  border-radius: 10px;
  border: 1px solid #c2c2c2;
}

/* .center {
  display: table-cell;
  width: 100%;
  vertical-align: middle;
} */
.modal-header {
  border-bottom: 1px solid #c2c2c2;
  padding: 16px;
  align-items: center;
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.modal-body {
  padding: 16px;
  width: 100%;
  margin: 0px !important;
  /* max-height: 400px; */
  /* overflow-y: auto; */
}

.modal-footer {
  border-top: 1px solid #c2c2c2;
  padding: 16px;
  display: flex;
  justify-content: end;
}
.close {
  color: #aaaaaa;
  top: -5px;
  float: right;
  /* font-size: 28px; */
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
.modal-title {
  margin: 0;
  /* display: flex; */
}
</style>
