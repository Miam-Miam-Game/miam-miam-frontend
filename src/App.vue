<script setup>
import { ref } from "vue";
import { io } from "socket.io-client";

import WaitingRoom from "./views/GameLobby.vue";
import GameView from "./views/GameView.vue";

const socket = io("http://localhost:4500");

const gameStarted = ref(false);
const countdown = ref(null);

// ✅ ICI : écoute du décompte serveur
socket.on("countdown", value => {
  countdown.value = value;
});

// ✅ Début réel du jeu
socket.on("gameStart", () => {
  countdown.value = null;
  gameStarted.value = true;
});

// ✅ Fin du jeu
socket.on("gameEnd", () => {
  gameStarted.value = false;
});
</script>

<template>
  <div v-if="!gameStarted">
    <WaitingRoom />

    <!-- ✅ affichage du décompte -->
    <div v-if="countdown !== null" class="countdown">
      Début dans {{ countdown }}...
    </div>
  </div>

  <GameView v-else />
</template>

<style scoped>
.countdown {
  font-size: 32px;
  font-weight: bold;
  margin-top: 20px;
}
</style>
