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
      <h1>Utilisateurs</h1>
      <router-link to="/user/new" class="btn btn-primary"> Nouvel utilisateur </router-link>
    </div>

    <div class="toolbar">
      <input
        v-model="search"
        type="text"
        class="form-control"
        placeholder="Rechercher un utilisateur…"
      />
    </div>

    <div v-if="loading" class="spinner"></div>
    <template v-else>
      <div v-if="!filtered.length" class="card" style="text-align: center; padding: 2rem">
        Aucun utilisateur trouvé.
      </div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Rôles</th>
              <th>Compétences</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in filtered" :key="u.id">
              <td>{{ u.nom }}</td>
              <td>{{ u.prenom }}</td>
              <td>{{ u.email }}</td>
              <td>
                <span
                  v-for="r in u.roles"
                  :key="r"
                  class="badge"
                  :class="r === 'ROLE_ADMIN' ? 'badge-warning' : 'badge-secondary'"
                  style="margin-right: 0.25rem"
                  >{{ r === 'ROLE_ADMIN' ? 'Admin' : 'Utilisateur' }}</span
                >
              </td>
              <td>{{ compNames(u) }}</td>
              <td class="actions">
                <router-link :to="`/user/${u.id}`" class="btn btn-sm btn-secondary"
                  >Voir</router-link
                >
                <router-link :to="`/user/${u.id}/edit`" class="btn btn-sm btn-secondary"
                  >Modifier</router-link
                >
                <button class="btn btn-sm btn-danger" @click="remove(u.id)">Supprimer</button>
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

const users = ref([]);
const loading = ref(true);
const search = ref('');

const filtered = computed(() => {
  if (!search.value) return users.value;
  const s = search.value.toLowerCase();
  return users.value.filter(
    (u) =>
      u.nom.toLowerCase().includes(s) ||
      u.prenom.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s),
  );
});

onMounted(async () => {
  try {
    const { data } = await api.get('/users');
    users.value = data;
  } finally {
    loading.value = false;
  }
});

async function remove(id) {
  if (!confirm('Supprimer cet utilisateur ?')) return;
  try {
    const token = await fetchCsrfToken();
    await api.delete(`/users/${id}`, { data: { _csrf: token } });
    users.value = users.value.filter((u) => u.id !== id);
  } catch (err) {
    alert(err.response?.data?.error || 'Erreur suppression.');
  }
}

function compNames(u) {
  if (!u.competenceUsers?.length) return '—';
  return u.competenceUsers
    .map((cu) => cu.competence?.nomCompetence)
    .filter(Boolean)
    .join(', ');
}
</script>
