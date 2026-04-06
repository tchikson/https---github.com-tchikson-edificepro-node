<template>
  <div class="page-container">
    <div v-if="loading" class="spinner"></div>
    <template v-else-if="competence">
      <h1>{{ competence.nomCompetence }}</h1>
      <div class="card" style="margin-bottom: 1.5rem">
        <dl class="detail-grid">
          <dt>Nom</dt>
          <dd>{{ competence.nomCompetence }}</dd>
          <dt>Créée le</dt>
          <dd>{{ fmtDate(competence.createdAt) }}</dd>
        </dl>
      </div>
      <div class="actions">
        <router-link :to="`/competence/${competence.id}/edit`" class="btn btn-primary"
          >Modifier</router-link
        >
        <router-link to="/competence" class="btn btn-secondary">Retour</router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../api';

const route = useRoute();
const competence = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get(`/competences/${route.params.id}`);
    competence.value = data;
  } finally {
    loading.value = false;
  }
});

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('fr-FR') : '';
}
</script>
