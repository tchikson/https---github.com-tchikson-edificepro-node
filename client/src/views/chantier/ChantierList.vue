<template>
  <div class="page-container">
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      "
    >
      <h1>Chantiers</h1>
      <router-link v-if="isAdmin()" to="/chantier/new" class="btn btn-primary">
        Nouveau chantier
      </router-link>
    </div>

    <div class="toolbar">
      <input v-model="search" type="text" class="form-control" placeholder="Rechercher un lieu…" />
      <select v-model="filterStatus" class="form-control">
        <option value="">Tous les statuts</option>
        <option value="en_cours">En cours</option>
        <option value="en_pause">En pause</option>
        <option value="termine">Terminé</option>
      </select>
    </div>

    <div v-if="loading" class="spinner"></div>
    <template v-else>
      <div v-if="!filtered.length" class="card" style="text-align: center; padding: 2rem">
        Aucun chantier trouvé.
      </div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Lieu</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Statut</th>
              <th>Équipes</th>
              <th v-if="isAdmin()">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.id">
              <td>
                <router-link :to="`/chantier/${c.id}`">{{ c.lieu }}</router-link>
              </td>
              <td>{{ fmtDate(c.dateDebut) }}</td>
              <td>{{ fmtDate(c.dateFin) }}</td>
              <td>
                <span :class="badge(c.status)">{{ label(c.status) }}</span>
              </td>
              <td>{{ eqNames(c) }}</td>
              <td v-if="isAdmin()" class="actions">
                <router-link :to="`/chantier/${c.id}/edit`" class="btn btn-sm btn-secondary"
                  >Modifier</router-link
                >
                <button class="btn btn-sm btn-danger" @click="remove(c.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';
import { isAdmin, fetchCsrfToken } from '../../auth';

const chantiers = ref([]);
const loading = ref(true);
const search = ref('');
const filterStatus = ref('');

const filtered = computed(() => {
  return chantiers.value.filter((c) => {
    if (search.value && !c.lieu.toLowerCase().includes(search.value.toLowerCase())) return false;
    if (filterStatus.value && c.status !== filterStatus.value) return false;
    return true;
  });
});

onMounted(async () => {
  try {
    const { data } = await api.get('/chantiers');
    chantiers.value = data;
  } finally {
    loading.value = false;
  }
});

async function remove(id) {
  if (!confirm('Supprimer ce chantier ?')) return;
  const token = await fetchCsrfToken();
  await api.delete(`/chantiers/${id}`, { data: { _csrf: token } });
  chantiers.value = chantiers.value.filter((c) => c.id !== id);
}

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
function eqNames(c) {
  return (
    c.affectations
      ?.map((a) => a.equipe?.nomEquipe)
      .filter(Boolean)
      .join(', ') || '—'
  );
}
</script>
