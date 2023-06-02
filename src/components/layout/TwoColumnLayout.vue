<template>
  <slot name="title" />
  <main class="grid-container">
    <slot name="left" />
    <slot name="right" />
  </main>
</template>
<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 32px;
}
</style>
