<template>
  <main>
    <a class="backBtn" @click="$router.go(-1)">กลับ</a>
    <h1>{{ title }}</h1>
    <article>
      <slot name="content"></slot>
    </article>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: { title: { type: String, default: 'title' } }
})
</script>

<style scope>
.backBtn {
  cursor: pointer;
  color: rgb(0, 0, 0);
  text-decoration: underline;
}
</style>
