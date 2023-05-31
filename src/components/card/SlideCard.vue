<template>
  <div style="padding: 0px 0px">
    <div class="flex-container">
      <div class="flex-item" style="margin-top: 8px">
        <slot name="left" />
      </div>
      <div class="flex-item center">
        <div class="card-slide">
          <slot name="head" />
          <br />
          <slot name="body" />
          <br />
          <slot name="footer" />
        </div>
      </div>
      <div class="flex-item" style="margin-top: 8px"><slot name="right" /></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>
<style scoped>
.card-slide {
  border-radius: 8px;
  border: 1px solid rgb(168, 168, 168);
  padding: 12px;
}
.flex-container {
  display: flex;
  width: 100%;
}
.flex-item {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 5%;
}
.center {
  flex-basis: 85%;
  margin: 0px 2%;
}
</style>
