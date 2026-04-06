import { reactive } from 'vue';
import api from './api';

export const auth = reactive({
  user: null,
  loading: true,
});

export async function fetchUser() {
  try {
    const { data } = await api.get('/auth/me');
    auth.user = data.user;
  } catch {
    auth.user = null;
  } finally {
    auth.loading = false;
  }
}

export function isAdmin() {
  return auth.user && auth.user.roles && auth.user.roles.includes('ROLE_ADMIN');
}

export async function fetchCsrfToken() {
  const { data } = await api.get('/csrf-token');
  return data.csrfToken;
}
