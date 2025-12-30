<script setup>
import { ref } from "vue";
import { socket } from "../socket";

const props = defineProps({
  players: Array,
  countdown: Number,
  joined: Boolean
});

const username = ref("");

function joinGame() {
  if (!username.value) return;
  socket.emit("join", { username: username.value });
}
</script>

<template>
  <div class="container">

    <!-- Entrée pseudo -->
    <div v-if="!props.joined">
      <h2>Entrer votre pseudo</h2>
      <input v-model="username" placeholder="Pseudo" />
      <button @click="joinGame">Rejoindre</button>
    </div>

    <!-- Salle d’attente -->
    <div v-else>
      <h2>Salle d'attente</h2>
      <p>{{ props.players.length }} / 3 joueurs</p>

      <ul>
        <li v-for="p in props.players" :key="p">{{ p }}</li>
      </ul>

      <div v-if="props.countdown !== null" class="countdown">
        Début dans {{ props.countdown }}...
      </div>
    </div>

  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
}
.countdown {
  margin-top: 20px;
  font-size: 2rem;
  font-weight: bold;
}
</style>
