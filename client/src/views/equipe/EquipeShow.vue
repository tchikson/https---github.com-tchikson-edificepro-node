<template>
  <div class="page-container">
    <div v-if="loading" class="spinner"></div>
    <template v-else-if="equipe">
      <h1>Équipe — {{ equipe.nomEquipe }}</h1>

      <div class="card" style="margin-bottom: 1.5rem">
        <dl class="detail-grid">
          <dt>Nom</dt>
          <dd>{{ equipe.nomEquipe }}</dd>
          <dt>Chef d'équipe</dt>
          <dd>
            {{ equipe.chefEquipe ? `${equipe.chefEquipe.prenom} ${equipe.chefEquipe.nom}` : '—' }}
          </dd>
          <dt>Date de début</dt>
          <dd>{{ fmtDate(equipe.dateDebut) }}</dd>
          <dt>Date de fin</dt>
          <dd>{{ fmtDate(equipe.dateFin) }}</dd>
        </dl>
      </div>

      <h2>Membres</h2>
      <div class="card" style="margin-bottom: 1.5rem">
        <ul v-if="equipe.equipeUsers?.length">
          <li v-for="eu in equipe.equipeUsers" :key="eu.id">
            {{ eu.utilisateur?.prenom }} {{ eu.utilisateur?.nom }} ({{ fmtDate(eu.dateDebut) }} →
            {{ fmtDate(eu.dateFin) }})
          </li>
        </ul>
        <p v-else>Aucun membre.</p>
      </div>

      <h2>Chantiers affectés</h2>
      <div class="card" style="margin-bottom: 1.5rem">
        <ul v-if="equipe.affectations?.length">
          <li v-for="a in equipe.affectations" :key="a.id">
            <router-link :to="`/chantier/${a.chantier?.id}`">{{ a.chantier?.lieu }}</router-link>
            ({{ fmtDate(a.dateDebut) }} → {{ fmtDate(a.dateFin) }})
          </li>
        </ul>
        <p v-else>Aucun chantier affecté.</p>
      </div>

      <div class="actions" v-if="isAdmin()">
        <router-link :to="`/equipe/${equipe.id}/edit`" class="btn btn-primary"
          >Modifier</router-link
        >
        <router-link to="/equipe" class="btn btn-secondary">Retour</router-link>
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
const equipe = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get(`/equipes/${route.params.id}`);
    equipe.value = data;
  } finally {
    loading.value = false;
  }
});

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('fr-FR') : '';
}
</script>
