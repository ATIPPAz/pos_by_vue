<template>
  <main>
    <a class="backBtn" @click="$emit('click:backBtn')">กลับ</a> <br />
    <slot name="title" />
    <slot name="content" />
  </main>
</template>

<style scoped>
.backBtn {
  cursor: pointer;
  color: rgb(0, 0, 0);
  text-decoration: underline;
}
</style>
