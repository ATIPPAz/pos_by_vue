<script lang="ts">
import { computed, defineProps } from 'vue'

export default {
  //   emits: ['onClose'],
  props: { title: { type: String, default: 'title' } },
  //   props: {
  //     title: { type: String, default: 'title' }
  //   },
  setup(props) {
    // const props = defineProps({
    //   title: { type: String, default: 'title' }
    // })
    // defineProps({
    //   title: props.title
    // })

    return {}
  }
}
</script>

<template>
  <main>
    <a class="backBtn" @click="$router.go(-1)">กลับ</a>
    <h1>{{ title }}</h1>
    <article>
      <slot name="content"></slot>
    </article>
  </main>
</template>
<style scope>
.backBtn {
  cursor: pointer;
  color: rgb(0, 0, 0);
  text-decoration: underline;
}
</style>
