<template>
  <footer class="app-footer">
    <p>
      &copy; {{ year }} ÉdificePro &mdash;
      <router-link to="/mentions-legales">Mentions légales</router-link>
    </p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear();
</script>
