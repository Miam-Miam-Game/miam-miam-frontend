<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";

const socket = io("http://localhost:4500");

const username = ref("");
const joined = ref(false);
const players = ref([]);
const countdown = ref(null);
let countdownInterval = null;

/* --- Rejoindre la salle --- */
function joinGame() {
  if (!username.value) return;
  socket.emit("join", { username: username.value });
  joined.value = true;
}

/* --- Réception salle d'attente --- */
socket.on("waitingRoom", data => {
  players.value = data.players;
});

/* --- Début de partie --- */
socket.on("gameStart", () => {
  startCountdown(10); // décompte avant lancement du jeu
});

/* --- Décompte --- */
function startCountdown(seconds) {
  countdown.value = seconds;

  countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
}

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>

<template>
  <div class="container">
    
    <!-- Entrée pseudo -->
    <div v-if="!joined">
      <h2>Entrer votre pseudo</h2>
      <input v-model="username" placeholder="Pseudo" />
      <button @click="joinGame">Rejoindre</button>
    </div>

    <!-- Salle d’attente -->
    <div v-else>
      <h2>Salle d'attente</h2>
      <p>{{ players.length }} / 3 joueurs</p>

      <ul>
        <li v-for="p in players" :key="p">{{ p }}</li>
      </ul>

      <!-- Décompte -->
      <div v-if="countdown !== null" class="countdown">
        Début dans… {{ countdown }}
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

input {
  padding: 8px;
  margin-bottom: 10px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

.countdown {
  margin-top: 20px;
  font-size: 2rem;
  font-weight: bold;
}
</style>
