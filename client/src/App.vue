<template>
  <div v-if="auth.loading" class="spinner"></div>
  <template v-else>
    <AppHeader v-if="auth.user" />
    <router-view />
    <AppFooter v-if="auth.user" />
  </template>
</template>

<script setup>
import { auth } from './auth';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>
