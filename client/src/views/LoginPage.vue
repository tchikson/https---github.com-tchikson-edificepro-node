<template>
  <div class="login-container">
    <div class="login-card">
      <h1>ÉdificePro</h1>
      <p class="subtitle">Gestion de chantiers</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="email">Adresse e-mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-control"
            autocomplete="username"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-control"
            autocomplete="current-password"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%" :disabled="loading">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>

      <p style="text-align: center; margin-top: 1.5rem">
        <router-link to="/mentions-legales">Mentions légales</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { auth, fetchCsrfToken } from '../auth';

const router = useRouter();
const loading = ref(false);
const error = ref('');
const form = reactive({ email: '', password: '' });

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    const token = await fetchCsrfToken();
    const { data } = await api.post('/auth/login', {
      email: form.email,
      password: form.password,
      _csrf: token,
    });
    auth.user = data.user;
    auth.loading = false;
    router.push(data.user.roles.includes('ROLE_ADMIN') ? '/admin' : '/dashboard');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur de connexion.';
  } finally {
    loading.value = false;
  }
}
</script>
