<template>
  <div class="card">
    <slot />
  </div>
</template>

<style>
.card {
  border-radius: 8px;
  border: 1px solid #d2d2d2;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  padding: 24px;
  color: black;
  cursor: pointer;
  font-size: 16px;
}
</style>
