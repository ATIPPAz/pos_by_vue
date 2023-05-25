<template>
  <main>
    <a class="backBtn" @click="$emit('click:backBtn')">กลับ</a> <br />
    <slot name="title" />
    <slot name="content" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>

<style scope>
.backBtn {
  cursor: pointer;
  color: rgb(0, 0, 0);
  text-decoration: underline;
}
</style>
