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
      <h1>Compétences</h1>
      <router-link to="/competence/new" class="btn btn-primary"> Nouvelle compétence </router-link>
    </div>

    <div class="toolbar">
      <input v-model="search" type="text" class="form-control" placeholder="Rechercher…" />
    </div>

    <div v-if="loading" class="spinner"></div>
    <template v-else>
      <div v-if="!filtered.length" class="card" style="text-align: center; padding: 2rem">
        Aucune compétence trouvée.
      </div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.id">
              <td>
                <router-link :to="`/competence/${c.id}`">{{ c.nomCompetence }}</router-link>
              </td>
              <td class="actions">
                <router-link :to="`/competence/${c.id}/edit`" class="btn btn-sm btn-secondary"
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
import { fetchCsrfToken } from '../../auth';

const competences = ref([]);
const loading = ref(true);
const search = ref('');

const filtered = computed(() => {
  if (!search.value) return competences.value;
  const s = search.value.toLowerCase();
  return competences.value.filter((c) => c.nomCompetence.toLowerCase().includes(s));
});

onMounted(async () => {
  try {
    const { data } = await api.get('/competences');
    competences.value = data;
  } finally {
    loading.value = false;
  }
});

async function remove(id) {
  if (!confirm('Supprimer cette compétence ?')) return;
  const token = await fetchCsrfToken();
  await api.delete(`/competences/${id}`, { data: { _csrf: token } });
  competences.value = competences.value.filter((c) => c.id !== id);
}
</script>
