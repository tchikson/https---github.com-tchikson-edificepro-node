<template>
  <div class="page-container">
    <div v-if="loading" class="spinner"></div>
    <template v-else-if="userProfile">
      <h1>{{ userProfile.prenom }} {{ userProfile.nom }}</h1>

      <div class="card" style="margin-bottom: 1.5rem">
        <dl class="detail-grid">
          <dt>Nom</dt>
          <dd>{{ userProfile.nom }}</dd>
          <dt>Prénom</dt>
          <dd>{{ userProfile.prenom }}</dd>
          <dt>Email</dt>
          <dd>{{ userProfile.email }}</dd>
          <dt>Rôles</dt>
          <dd>
            <span
              v-for="r in userProfile.roles"
              :key="r"
              class="badge"
              :class="r === 'ROLE_ADMIN' ? 'badge-warning' : 'badge-secondary'"
              style="margin-right: 0.25rem"
              >{{ r === 'ROLE_ADMIN' ? 'Admin' : 'Utilisateur' }}</span
            >
          </dd>
        </dl>
      </div>

      <h2>Compétences</h2>
      <div class="card" style="margin-bottom: 1.5rem">
        <ul v-if="userProfile.competenceUsers?.length">
          <li v-for="cu in userProfile.competenceUsers" :key="cu.id">
            {{ cu.competence?.nomCompetence }}
          </li>
        </ul>
        <p v-else>Aucune compétence.</p>
      </div>

      <h2>Équipes</h2>
      <div class="card" style="margin-bottom: 1.5rem">
        <ul v-if="userProfile.equipeUsers?.length">
          <li v-for="eu in userProfile.equipeUsers" :key="eu.id">
            <router-link :to="`/equipe/${eu.equipe?.id}`">{{ eu.equipe?.nomEquipe }}</router-link>
            ({{ fmtDate(eu.dateDebut) }} → {{ fmtDate(eu.dateFin) }})
          </li>
        </ul>
        <p v-else>Aucune équipe.</p>
      </div>

      <div class="actions">
        <router-link :to="`/user/${userProfile.id}/edit`" class="btn btn-primary"
          >Modifier</router-link
        >
        <router-link to="/user/list" class="btn btn-secondary">Retour</router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../api';

const route = useRoute();
const userProfile = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get(`/users/${route.params.id}`);
    userProfile.value = data;
  } finally {
    loading.value = false;
  }
});

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('fr-FR') : '';
}
</script>
