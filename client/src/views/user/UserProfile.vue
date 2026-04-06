<template>
  <div class="page-container">
    <h1>Mon espace</h1>

    <div v-if="loading" class="spinner"></div>
    <template v-else-if="profile">
      <div v-if="success" class="alert alert-success">{{ success }}</div>
      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <div class="card" style="margin-bottom: 1.5rem">
        <dl class="detail-grid">
          <dt>Nom</dt>
          <dd>{{ profile.nom }}</dd>
          <dt>Prénom</dt>
          <dd>{{ profile.prenom }}</dd>
          <dt>Email</dt>
          <dd>{{ profile.email }}</dd>
        </dl>
      </div>

      <h2>Mes compétences</h2>
      <div class="card" style="margin-bottom: 1.5rem">
        <ul v-if="profile.competenceUsers?.length">
          <li v-for="cu in profile.competenceUsers" :key="cu.id">
            {{ cu.competence?.nomCompetence }}
          </li>
        </ul>
        <p v-else>Aucune compétence enregistrée.</p>
      </div>

      <h2>Mes équipes</h2>
      <div class="card" style="margin-bottom: 1.5rem">
        <ul v-if="profile.equipeUsers?.length">
          <li v-for="eu in profile.equipeUsers" :key="eu.id">
            <router-link :to="`/equipe/${eu.equipe?.id}`">{{ eu.equipe?.nomEquipe }}</router-link>
          </li>
        </ul>
        <p v-else>Aucune équipe.</p>
      </div>

      <h2>Modifier mon profil</h2>
      <form class="card" @submit.prevent="updateProfile">
        <div class="form-group">
          <label for="nom">Nom</label>
          <input id="nom" v-model="form.nom" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="prenom">Prénom</label>
          <input id="prenom" v-model="form.prenom" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="form.email" type="email" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="password">Nouveau mot de passe (optionnel)</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-control"
            autocomplete="new-password"
          />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Enregistrement…' : 'Mettre à jour' }}
        </button>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../api';
import { fetchCsrfToken, fetchUser } from '../../auth';

const profile = ref(null);
const loading = ref(true);
const success = ref('');
const error = ref('');
const saving = ref(false);
const form = reactive({ nom: '', prenom: '', email: '', password: '' });

onMounted(async () => {
  try {
    const { data } = await api.get('/users/profile');
    profile.value = data;
    form.nom = data.nom;
    form.prenom = data.prenom;
    form.email = data.email;
  } finally {
    loading.value = false;
  }
});

async function updateProfile() {
  saving.value = true;
  success.value = '';
  error.value = '';
  try {
    const token = await fetchCsrfToken();
    const payload = { nom: form.nom, prenom: form.prenom, email: form.email, _csrf: token };
    if (form.password) payload.password = form.password;
    await api.put('/users/profile', payload);
    success.value = 'Profil mis à jour.';
    form.password = '';
    // Refresh auth state
    await fetchUser();
    // Refresh displayed profile
    const { data } = await api.get('/users/profile');
    profile.value = data;
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur mise à jour.';
  } finally {
    saving.value = false;
  }
}
</script>
