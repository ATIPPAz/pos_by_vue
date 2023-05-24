<template>
  <div class="modal" v-if="open" style="padding-top: 20px">
    <div class="modal-content" style="width: 400px">
      <div class="model-header">
        <span class="close" @click="close"> &times; </span>
        <p class="model-title">{{ title }}</p>
      </div>
      <div class="model-body">
        <div v-if="!hasBody">you can add your slot for custom your model here !!!</div>
        <slot v-if="hasBody" name="content"></slot>
      </div>
      <div class="model-footer">
        <div>
          <button @click="close" class="closeDialogButton gray">close</button>
          <button @click="saveModel" class="selectItem blue">ok</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
export default defineComponent({
  // props: ['title', 'open', 'saveFunction'],
  props: {
    title: {
      type: String,
      default: '',
      required: false
    },
    open: { type: Boolean, default: false, required: true }
  },
  emits: ['onClose', 'onSave'],

  setup(props, ctx) {
    function close() {
      ctx.emit('onClose')
    }
    function saveModel() {
      ctx.emit('onSave')
    }
    const hasBody = computed(() => !!ctx.slots.content)
    return {
      close,
      hasBody,
      saveModel
    }
  }
})
</script>

<style scope>
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
  width: fit-content;
}

.model-header {
  border-bottom: 1px solid #c2c2c2;
  padding: 16px;
}
.close {
  color: #aaaaaa;
  top: 10px;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
.model-body {
  padding: 16px;
}

.model-footer {
  border-top: 1px solid #c2c2c2;
  padding: 16px;
  display: flex;
  justify-content: end;
}

.model-title {
  margin: 0;
}
</style>
