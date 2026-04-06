<template>
  <div class="page-container">
    <h1>{{ isEdit ? 'Modifier la compétence' : 'Nouvelle compétence' }}</h1>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <form class="card" @submit.prevent="submit">
      <div class="form-group">
        <label for="nomCompetence">Nom de la compétence</label>
        <input id="nomCompetence" v-model="form.nomCompetence" class="form-control" required />
      </div>

      <div class="actions" style="margin-top: 1.5rem">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
        <router-link to="/competence" class="btn btn-secondary">Annuler</router-link>
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

const form = reactive({ nomCompetence: '' });
const error = ref('');
const saving = ref(false);

onMounted(async () => {
  if (isEdit.value) {
    const { data } = await api.get(`/competences/${route.params.id}`);
    form.nomCompetence = data.nomCompetence;
  }
});

async function submit() {
  saving.value = true;
  error.value = '';
  try {
    const token = await fetchCsrfToken();
    const payload = { ...form, _csrf: token };
    if (isEdit.value) {
      await api.put(`/competences/${route.params.id}`, payload);
    } else {
      await api.post('/competences', payload);
    }
    router.push('/competence');
  } catch (err) {
    error.value = err.response?.data?.error || "Erreur lors de l'enregistrement.";
  } finally {
    saving.value = false;
  }
}
</script>
