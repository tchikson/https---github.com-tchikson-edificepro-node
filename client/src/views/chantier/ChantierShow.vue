<template>
  <div class="page-container">
    <div v-if="loading" class="spinner"></div>
    <template v-else-if="chantier">
      <h1>Chantier — {{ chantier.lieu }}</h1>
      <div class="card" style="margin-bottom: 1.5rem">
        <dl class="detail-grid">
          <dt>Lieu</dt>
          <dd>{{ chantier.lieu }}</dd>
          <dt>Date de début</dt>
          <dd>{{ fmtDate(chantier.dateDebut) }}</dd>
          <dt>Date de fin</dt>
          <dd>{{ fmtDate(chantier.dateFin) }}</dd>
          <dt>Statut</dt>
          <dd>
            <span :class="badge(chantier.status)">{{ label(chantier.status) }}</span>
          </dd>
        </dl>
      </div>

      <h2>Compétences requises</h2>
      <div class="card" style="margin-bottom: 1.5rem">
        <ul v-if="chantier.competenceChantiers?.length">
          <li v-for="cc in chantier.competenceChantiers" :key="cc.id">
            {{ cc.competence?.nomCompetence }}
          </li>
        </ul>
        <p v-else>Aucune compétence requise.</p>
      </div>

      <h2>Équipes affectées</h2>
      <div class="card" style="margin-bottom: 1.5rem">
        <ul v-if="chantier.affectations?.length">
          <li v-for="a in chantier.affectations" :key="a.id">
            <router-link :to="`/equipe/${a.equipe?.id}`">{{ a.equipe?.nomEquipe }}</router-link>
            ({{ fmtDate(a.dateDebut) }} → {{ fmtDate(a.dateFin) }})
          </li>
        </ul>
        <p v-else>Aucune équipe affectée.</p>
      </div>

      <div class="actions" v-if="isAdmin()">
        <router-link :to="`/chantier/${chantier.id}/edit`" class="btn btn-primary"
          >Modifier</router-link
        >
        <router-link to="/chantier" class="btn btn-secondary">Retour</router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../api';
import { isAdmin } from '../../auth';

const route = useRoute();
const chantier = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get(`/chantiers/${route.params.id}`);
    chantier.value = data;
  } finally {
    loading.value = false;
  }
});

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('fr-FR') : '';
}
function label(s) {
  return { en_cours: 'En cours', en_pause: 'En pause', termine: 'Terminé' }[s] || s;
}
function badge(s) {
  return (
    {
      en_cours: 'badge badge-info',
      en_pause: 'badge badge-warning',
      termine: 'badge badge-success',
    }[s] || 'badge'
  );
}
</script>
