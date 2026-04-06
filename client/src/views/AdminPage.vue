<template>
  <div class="page-container">
    <h1>Administration</h1>
    <div class="admin-grid">
      <router-link to="/chantier" class="card">
        <h3>Chantiers</h3>
        <p>Gérer les chantiers</p>
      </router-link>
      <router-link to="/equipe" class="card">
        <h3>Équipes</h3>
        <p>Gérer les équipes</p>
      </router-link>
      <router-link to="/competence" class="card">
        <h3>Compétences</h3>
        <p>Gérer les compétences</p>
      </router-link>
      <router-link to="/user/list" class="card">
        <h3>Utilisateurs</h3>
        <p>Gérer les utilisateurs</p>
      </router-link>
    </div>
  </div>
</template>
