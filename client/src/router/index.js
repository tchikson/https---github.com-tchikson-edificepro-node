import { createRouter, createWebHistory } from 'vue-router';
import { auth, fetchUser } from '../auth';

import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import AdminPage from '../views/AdminPage.vue';
import ChantierList from '../views/chantier/ChantierList.vue';
import ChantierForm from '../views/chantier/ChantierForm.vue';
import ChantierShow from '../views/chantier/ChantierShow.vue';
import EquipeList from '../views/equipe/EquipeList.vue';
import EquipeForm from '../views/equipe/EquipeForm.vue';
import EquipeShow from '../views/equipe/EquipeShow.vue';
import CompetenceList from '../views/competence/CompetenceList.vue';
import CompetenceForm from '../views/competence/CompetenceForm.vue';
import CompetenceShow from '../views/competence/CompetenceShow.vue';
import UserList from '../views/user/UserList.vue';
import UserForm from '../views/user/UserForm.vue';
import UserShow from '../views/user/UserShow.vue';
import UserProfile from '../views/user/UserProfile.vue';
import MentionsLegales from '../views/MentionsLegales.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  { path: '/login', name: 'login', component: LoginPage, meta: { guest: true } },
  { path: '/mentions-legales', name: 'mentions', component: MentionsLegales },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage, meta: { auth: true } },
  { path: '/admin', name: 'admin', component: AdminPage, meta: { auth: true, admin: true } },

  { path: '/chantier', name: 'chantier-list', component: ChantierList, meta: { auth: true } },
  {
    path: '/chantier/new',
    name: 'chantier-new',
    component: ChantierForm,
    meta: { auth: true, admin: true },
  },
  { path: '/chantier/:id', name: 'chantier-show', component: ChantierShow, meta: { auth: true } },
  {
    path: '/chantier/:id/edit',
    name: 'chantier-edit',
    component: ChantierForm,
    meta: { auth: true, admin: true },
  },

  { path: '/equipe', name: 'equipe-list', component: EquipeList, meta: { auth: true } },
  {
    path: '/equipe/new',
    name: 'equipe-new',
    component: EquipeForm,
    meta: { auth: true, admin: true },
  },
  { path: '/equipe/:id', name: 'equipe-show', component: EquipeShow, meta: { auth: true } },
  {
    path: '/equipe/:id/edit',
    name: 'equipe-edit',
    component: EquipeForm,
    meta: { auth: true, admin: true },
  },

  {
    path: '/competence',
    name: 'competence-list',
    component: CompetenceList,
    meta: { auth: true, admin: true },
  },
  {
    path: '/competence/new',
    name: 'competence-new',
    component: CompetenceForm,
    meta: { auth: true, admin: true },
  },
  {
    path: '/competence/:id',
    name: 'competence-show',
    component: CompetenceShow,
    meta: { auth: true, admin: true },
  },
  {
    path: '/competence/:id/edit',
    name: 'competence-edit',
    component: CompetenceForm,
    meta: { auth: true, admin: true },
  },

  { path: '/user/list', name: 'user-list', component: UserList, meta: { auth: true, admin: true } },
  { path: '/user/new', name: 'user-new', component: UserForm, meta: { auth: true, admin: true } },
  { path: '/user/profile', name: 'user-profile', component: UserProfile, meta: { auth: true } },
  { path: '/user/:id', name: 'user-show', component: UserShow, meta: { auth: true, admin: true } },
  {
    path: '/user/:id/edit',
    name: 'user-edit',
    component: UserForm,
    meta: { auth: true, admin: true },
  },

  { path: '/', redirect: '/dashboard' },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (auth.loading) await fetchUser();

  if (to.meta.auth && !auth.user) {
    return { name: 'login' };
  }
  if (to.meta.admin && (!auth.user || !auth.user.roles.includes('ROLE_ADMIN'))) {
    return { name: 'dashboard' };
  }
  if (to.meta.guest && auth.user) {
    return auth.user.roles.includes('ROLE_ADMIN') ? { name: 'admin' } : { name: 'dashboard' };
  }
});

export default router;
