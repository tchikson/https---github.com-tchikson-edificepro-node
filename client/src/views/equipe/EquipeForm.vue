<template>
  <div class="page-container">
    <h1>{{ isEdit ? "Modifier l'équipe" : 'Nouvelle équipe' }}</h1>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <form class="card" @submit.prevent="submit">
      <div class="form-group">
        <label for="nomEquipe">Nom de l'équipe</label>
        <input id="nomEquipe" v-model="form.nomEquipe" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="chefEquipeId">Chef d'équipe</label>
        <select id="chefEquipeId" v-model="form.chefEquipeId" class="form-control">
          <option value="">— Aucun —</option>
          <option v-for="u in users" :key="u.id" :value="u.id">{{ u.prenom }} {{ u.nom }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="dateDebut">Date de début</label>
        <input id="dateDebut" v-model="form.dateDebut" type="date" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="dateFin">Date de fin</label>
        <input id="dateFin" v-model="form.dateFin" type="date" class="form-control" required />
      </div>

      <div class="form-group">
        <label>Membres</label>
        <div class="checkbox-grid">
          <label v-for="u in users" :key="u.id">
            <input type="checkbox" :value="u.id" v-model="form.membres" /> {{ u.prenom }}
            {{ u.nom }}
          </label>
        </div>
      </div>

      <div class="actions" style="margin-top: 1.5rem">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
        <router-link to="/equipe" class="btn btn-secondary">Annuler</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../api';
import { fetchCsrfToken } from '../../auth';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);

const form = reactive({
  nomEquipe: '',
  chefEquipeId: '',
  dateDebut: '',
  dateFin: '',
  membres: [],
});
const users = ref([]);
const error = ref('');
const saving = ref(false);

onMounted(async () => {
  const { data } = await api.get('/users');
  users.value = data;

  if (isEdit.value) {
    const { data: eq } = await api.get(`/equipes/${route.params.id}`);
    form.nomEquipe = eq.nomEquipe;
    form.chefEquipeId = eq.chefEquipeId || '';
    form.dateDebut = eq.dateDebut?.slice(0, 10) || '';
    form.dateFin = eq.dateFin?.slice(0, 10) || '';
    form.membres = eq.equipeUsers?.map((eu) => eu.utilisateurId) || [];
  }
});

async function submit() {
  saving.value = true;
  error.value = '';
  try {
    const token = await fetchCsrfToken();
    const payload = { ...form, _csrf: token };
    if (isEdit.value) {
      await api.put(`/equipes/${route.params.id}`, payload);
    } else {
      await api.post('/equipes', payload);
    }
    router.push('/equipe');
  } catch (err) {
    error.value = err.response?.data?.error || "Erreur lors de l'enregistrement.";
  } finally {
    saving.value = false;
  }
}
</script>
