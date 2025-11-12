<template>
  <div class="profile-container">
    <h1>Mon Profil</h1>
    <div v-if="session.isAuthenticated" class="user-info">
      <p><strong>Nom :</strong> {{ session.userName }}</p>
      <p><strong>Email :</strong> {{ session.user?.email }}</p>
      <p><strong>Rôle :</strong> {{ session.user?.role }}</p>
    </div>
    <p v-else>Non connecté</p>
  </div>
</template>

<script setup>
import { useSession } from '~/stores/session'

const session = useSession()
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.user-info {
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.user-info p {
  color: black;
  margin: 10px 0;
}
</style>