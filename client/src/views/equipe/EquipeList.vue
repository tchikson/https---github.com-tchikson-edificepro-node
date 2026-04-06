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
      <h1>Équipes</h1>
      <router-link v-if="isAdmin()" to="/equipe/new" class="btn btn-primary">
        Nouvelle équipe
      </router-link>
    </div>

    <div class="toolbar">
      <input
        v-model="search"
        type="text"
        class="form-control"
        placeholder="Rechercher une équipe…"
      />
    </div>

    <div v-if="loading" class="spinner"></div>
    <template v-else>
      <div v-if="!filtered.length" class="card" style="text-align: center; padding: 2rem">
        Aucune équipe trouvée.
      </div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Chef d'équipe</th>
              <th>Membres</th>
              <th v-if="isAdmin()">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in filtered" :key="e.id">
              <td>
                <router-link :to="`/equipe/${e.id}`">{{ e.nomEquipe }}</router-link>
              </td>
              <td>{{ e.chefEquipe ? `${e.chefEquipe.prenom} ${e.chefEquipe.nom}` : '—' }}</td>
              <td>{{ e.equipeUsers?.length || 0 }} membre(s)</td>
              <td v-if="isAdmin()" class="actions">
                <router-link :to="`/equipe/${e.id}/edit`" class="btn btn-sm btn-secondary"
                  >Modifier</router-link
                >
                <button class="btn btn-sm btn-danger" @click="remove(e.id)">Supprimer</button>
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

const equipes = ref([]);
const loading = ref(true);
const search = ref('');

const filtered = computed(() => {
  if (!search.value) return equipes.value;
  const s = search.value.toLowerCase();
  return equipes.value.filter((e) => e.nomEquipe.toLowerCase().includes(s));
});

onMounted(async () => {
  try {
    const { data } = await api.get('/equipes');
    equipes.value = data;
  } finally {
    loading.value = false;
  }
});

async function remove(id) {
  if (!confirm('Supprimer cette équipe ?')) return;
  const token = await fetchCsrfToken();
  await api.delete(`/equipes/${id}`, { data: { _csrf: token } });
  equipes.value = equipes.value.filter((e) => e.id !== id);
}
</script>
