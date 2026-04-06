<template>
  <div class="page-container">
    <div class="hero">
      <h1>Tableau de bord</h1>
      <p>Vue d'ensemble de vos chantiers</p>
    </div>

    <div v-if="loading" class="spinner"></div>
    <template v-else>
      <div v-if="!chantiers.length" class="card" style="text-align: center; padding: 3rem">
        <p>Aucun chantier à afficher.</p>
      </div>

      <div v-else>
        <h2>Planning des chantiers</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lieu</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Équipes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in chantiers" :key="c.id">
                <td>
                  <router-link :to="`/chantier/${c.id}`">{{ c.lieu }}</router-link>
                </td>
                <td>{{ formatDate(c.dateDebut) }}</td>
                <td>{{ formatDate(c.dateFin) }}</td>
                <td>
                  <span :class="statusBadge(c.status)">{{ statusLabel(c.status) }}</span>
                </td>
                <td>{{ equipeNames(c.affectations) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const chantiers = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get('/dashboard');
    chantiers.value = data.chantiers;
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false;
  }
});

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR');
}

function statusLabel(s) {
  const map = { en_cours: 'En cours', en_pause: 'En pause', termine: 'Terminé' };
  return map[s] || s;
}

function statusBadge(s) {
  const map = {
    en_cours: 'badge badge-info',
    en_pause: 'badge badge-warning',
    termine: 'badge badge-success',
  };
  return map[s] || 'badge badge-secondary';
}

function equipeNames(affectations) {
  if (!affectations || !affectations.length) return '—';
  return affectations.map((a) => a.equipe?.nomEquipe || '?').join(', ');
}
</script>
