<template>
  <div class="page-container">
    <h1>{{ isEdit ? 'Modifier le chantier' : 'Nouveau chantier' }}</h1>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <form class="card" @submit.prevent="submit">
      <div class="form-group">
        <label for="lieu">Lieu</label>
        <input id="lieu" v-model="form.lieu" class="form-control" required />
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
        <label for="status">Statut</label>
        <select id="status" v-model="form.status" class="form-control">
          <option value="en_cours">En cours</option>
          <option value="en_pause">En pause</option>
          <option value="termine">Terminé</option>
        </select>
      </div>

      <div class="form-group">
        <label>Compétences requises</label>
        <div class="checkbox-grid">
          <label v-for="c in competences" :key="c.id">
            <input type="checkbox" :value="c.id" v-model="form.competences" /> {{ c.nomCompetence }}
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Équipes</label>
        <div class="checkbox-grid">
          <label v-for="e in equipes" :key="e.id">
            <input type="checkbox" :value="e.id" v-model="form.equipes" /> {{ e.nomEquipe }}
          </label>
        </div>
      </div>

      <div class="actions" style="margin-top: 1.5rem">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
        <router-link to="/chantier" class="btn btn-secondary">Annuler</router-link>
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
  lieu: '',
  dateDebut: '',
  dateFin: '',
  status: 'en_cours',
  competences: [],
  equipes: [],
});
const competences = ref([]);
const equipes = ref([]);
const error = ref('');
const saving = ref(false);

onMounted(async () => {
  const [compRes, eqRes] = await Promise.all([api.get('/competences'), api.get('/equipes')]);
  competences.value = compRes.data;
  equipes.value = eqRes.data;

  if (isEdit.value) {
    const { data } = await api.get(`/chantiers/${route.params.id}`);
    form.lieu = data.lieu;
    form.dateDebut = data.dateDebut?.slice(0, 10) || '';
    form.dateFin = data.dateFin?.slice(0, 10) || '';
    form.status = data.status;
    form.competences = data.competenceChantiers?.map((cc) => cc.competenceId) || [];
    form.equipes = data.affectations?.map((a) => a.equipeId) || [];
  }
});

async function submit() {
  saving.value = true;
  error.value = '';
  try {
    const token = await fetchCsrfToken();
    const payload = { ...form, _csrf: token };
    if (isEdit.value) {
      await api.put(`/chantiers/${route.params.id}`, payload);
    } else {
      await api.post('/chantiers', payload);
    }
    router.push('/chantier');
  } catch (err) {
    error.value = err.response?.data?.error || "Erreur lors de l'enregistrement.";
  } finally {
    saving.value = false;
  }
}
</script>
