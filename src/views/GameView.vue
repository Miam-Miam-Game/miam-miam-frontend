<script setup>
import { ref } from "vue";
import { socket } from "../socket";

const props = defineProps({
  playerInfo: Object
});

// gameState envoyé par le serveur
const gameState = ref({
  players: [] // [{ num, username, color, x, y }]
});

// écoute du serveur
socket.on("gameState", state => {
  gameState.value = state;
});
</script>

<template>
  <div class="game-wrapper">

    <!-- 🟦 Zone de jeu -->
    <div class="game-area">
      <div class="board">
        <!-- Affichage des pions -->
        <div
          v-for="p in gameState.players"
          :key="p.num"
          class="pawn"
          :style="{
            backgroundColor: p.color,
            left: p.x + 'px',
            top: p.y + 'px'
          }"
        ></div>
      </div>
    </div>

    <!-- 🟧 Infos du joueur -->
    <div class="sidebar">
      <h3>Ton joueur</h3>
      <p>Numéro : {{ props.playerInfo.playerNumber }}</p>
      <p>Pseudo : {{ props.playerInfo.username }}</p>
      <p>
        Couleur :
        <span class="dot" :style="{ backgroundColor: props.playerInfo.color }"></span>
      </p>

      <h3>Joueurs</h3>
      <ul>
        <li v-for="p in gameState.players" :key="p.num">
          <span class="dot" :style="{ backgroundColor: p.color }"></span>
          Joueur {{ p.num }} — {{ p.username }}
        </li>
      </ul>
    </div>

  </div>
</template>

<style scoped>
/* Layout global */
.game-wrapper {
  display: flex;
  gap: 20px;
  padding: 20px;
}

/* 🟦 Zone de jeu */
.game-area {
  flex: 1;
  display: flex;
  justify-content: center;
}

.board {
  width: 400px;
  height: 400px;
  background: #f0f0f0;
  border: 3px solid #333;
  position: relative;
}

/* 🟢 Pions */
.pawn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: absolute;
}

/* 🟧 Sidebar */
.sidebar {
  width: 200px;
  padding: 10px;
  border-left: 2px solid #ccc;
}

.dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 6px;
}
</style>
