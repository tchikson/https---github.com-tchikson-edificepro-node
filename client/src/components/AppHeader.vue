<template>
  <header class="app-header">
    <router-link to="/dashboard" class="logo">
      <span>ÉdificePro</span>
    </router-link>
    <nav>
      <router-link to="/dashboard">Tableau de bord</router-link>
      <router-link to="/chantier">Chantiers</router-link>
      <router-link to="/equipe">Équipes</router-link>
      <template v-if="isAdmin()">
        <router-link to="/competence">Compétences</router-link>
        <router-link to="/user/list">Utilisateurs</router-link>
        <router-link to="/admin">Administration</router-link>
      </template>
      <router-link to="/user/profile">Mon profil</router-link>
      <button @click="doLogout">Déconnexion</button>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import api from '../api';
import { auth, isAdmin } from '../auth';

const router = useRouter();

async function doLogout() {
  try {
    await api.post('/auth/logout');
  } catch {
    // ignore
  }
  auth.user = null;
  router.push('/login');
}
</script>
