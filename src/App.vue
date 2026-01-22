<script setup>
import { ref } from "vue";
import { socket } from "./socket";

import GameLobby from "./views/GameLobby.vue";
import GameView from "./views/GameView.vue";
import WinnerView from "./views/WinnerView.vue";


const joined = ref(false);        // Le joueur a entré son pseudo
const players = ref([]);          // Liste des joueurs
const playerInfo = ref(null);     // Infos du joueur (numéro, couleur, pseudo)
const countdown = ref(null);      // Décompte avant la partie
const gameStarted = ref(false);   // La partie commence
const gameOverData = ref(null);


/* --- Le joueur a rejoint --- */
socket.on("playerInfo", data => {
  playerInfo.value = data;
  joined.value = true;
});

/* --- Salle d’attente --- */
socket.on("waitingRoom", data => {
  players.value = data.players;
});

/* --- Décompte --- */
socket.on("countdown", value => {
  countdown.value = value;
});

/* --- Début du jeu --- */
socket.on("gameStart", () => {
  gameStarted.value = true;
});

socket.on("gameOver", data => {
  gameOverData.value = data;
  gameStarted.value = false; // On quitte GameView
});

/* --- Fin du jeu --- */
socket.on("gameEnd", () => {
  joined.value = false;
  countdown.value = null;
});

function resetGame() {
  gameOverData.value = null;
  joined.value = false;
  players.value = [];
  playerInfo.value = null;
}


</script>

<template>
  <div id="app-root">
    <!-- Pas encore rejoint -->
    <GameLobby v-if="!joined && !gameOverData" />

    <!-- Rejoint mais partie pas encore lancée -->
    <GameLobby
      v-else-if="joined && !gameStarted && !gameOverData"
      :players="players"
      :countdown="countdown"
      joined
    />

    <!-- Partie en cours -->
    <GameView
      v-else-if="gameStarted"
      :playerInfo="playerInfo"
    />

    <!-- Écran de fin -->
    <WinnerView
      v-else-if="gameOverData"
      :bestPlayer="gameOverData.bestPlayer"
      :players="gameOverData.players"
      :isRecord="gameOverData.isRecord"
      :bestRecord="gameOverData.bestRecord"
      @restart="resetGame"
    />

  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
}

#app-root {
  width: 100vw;
  height: 100vh;
}
</style>
