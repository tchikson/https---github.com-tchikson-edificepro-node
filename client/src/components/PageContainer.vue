<template>
  <div class="page-container">
    <div
      v-if="flash"
      :class="['alert', flash.type === 'success' ? 'alert-success' : 'alert-error']"
    >
      {{ flash.message }}
    </div>
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const flash = ref(null);

function showFlash(message, type = 'success') {
  flash.value = { message, type };
  setTimeout(() => {
    flash.value = null;
  }, 4000);
}

onMounted(() => {
  // Expose globally for views to call
});

defineExpose({ showFlash });
</script>
