<template>
  <div class="flex-container">
    <div class="flex-item" style="margin-top: 8px; text-align: center">
      <slot name="left" />
    </div>
    <div class="flex-item center">
      <div class="card-slide">
        <slot name="head" />
        <br />
        <slot name="body" />
        <div style="margin-top: 16px; text-align: center" />
        <slot name="footer" />
      </div>
    </div>
    <div class="flex-item" style="margin-top: 8px"><slot name="right" /></div>
  </div>
</template>

<style scoped>
.card-slide {
  border-radius: 8px;
  border: 1px solid rgb(168, 168, 168);
  padding: 16px;
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
