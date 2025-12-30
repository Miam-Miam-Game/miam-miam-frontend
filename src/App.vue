<script setup>
import { ref } from "vue";
import { socket } from "./socket";

import GameLobby from "./views/GameLobby.vue";
import GameView from "./views/GameView.vue";

const joined = ref(false);        // Le joueur a entré son pseudo
const players = ref([]);          // Liste des joueurs
const playerInfo = ref(null);     // Infos du joueur (numéro, couleur, pseudo)
const countdown = ref(null);      // Décompte avant la partie
const gameStarted = ref(false);   // La partie commence

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

/* --- Fin du jeu --- */
socket.on("gameEnd", () => {
  gameStarted.value = false;
  joined.value = false;
  countdown.value = null;
  players.value = [];
  playerInfo.value = null;
});
</script>

<template>
  <!-- Pas encore rejoint -->
  <GameLobby
    v-if="!joined"
  />

  <!-- Rejoint mais partie pas encore lancée -->
  <div v-else-if="!gameStarted">
    <GameLobby
      :players="players"
      :countdown="countdown"
      joined
    />
  </div>

  <!-- Partie en cours -->
  <GameView
    v-else
    :playerInfo="playerInfo"
  />
</template>
