<template>
  <div class="page-container">
    <h1>{{ isEdit ? "Modifier l'utilisateur" : 'Nouvel utilisateur' }}</h1>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <form class="card" @submit.prevent="submit">
      <div class="form-group">
        <label for="nom">Nom</label>
        <input id="nom" v-model="form.nom" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="prenom">Prénom</label>
        <input id="prenom" v-model="form.prenom" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="form-control"
          autocomplete="off"
          required
        />
      </div>
      <div class="form-group">
        <label for="password"
          >Mot de passe{{ isEdit ? ' (laisser vide pour ne pas changer)' : '' }}</label
        >
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="form-control"
          autocomplete="new-password"
          :required="!isEdit"
        />
      </div>
      <div class="form-group">
        <label>Rôles</label>
        <div class="checkbox-grid">
          <label>
            <input type="checkbox" value="ROLE_USER" v-model="form.roles" disabled checked />
            Utilisateur
          </label>
          <label>
            <input type="checkbox" value="ROLE_ADMIN" v-model="form.roles" /> Administrateur
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Compétences</label>
        <div class="checkbox-grid">
          <label v-for="c in competences" :key="c.id">
            <input type="checkbox" :value="c.id" v-model="form.competences" /> {{ c.nomCompetence }}
          </label>
        </div>
      </div>

      <div class="actions" style="margin-top: 1.5rem">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
        <router-link to="/user/list" class="btn btn-secondary">Annuler</router-link>
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
  nom: '',
  prenom: '',
  email: '',
  password: '',
  roles: ['ROLE_USER'],
  competences: [],
});
const competences = ref([]);
const error = ref('');
const saving = ref(false);

onMounted(async () => {
  const { data: compData } = await api.get('/competences');
  competences.value = compData;

  if (isEdit.value) {
    const { data } = await api.get(`/users/${route.params.id}`);
    form.nom = data.nom;
    form.prenom = data.prenom;
    form.email = data.email;
    form.roles = data.roles || ['ROLE_USER'];
    form.competences = data.competenceUsers?.map((cu) => cu.competenceId) || [];
  }
});

async function submit() {
  saving.value = true;
  error.value = '';
  try {
    const token = await fetchCsrfToken();
    const payload = { ...form, _csrf: token };
    if (!payload.password) delete payload.password;
    if (isEdit.value) {
      await api.put(`/users/${route.params.id}`, payload);
    } else {
      await api.post('/users', payload);
    }
    router.push('/user/list');
  } catch (err) {
    error.value = err.response?.data?.error || "Erreur lors de l'enregistrement.";
  } finally {
    saving.value = false;
  }
}
</script>
