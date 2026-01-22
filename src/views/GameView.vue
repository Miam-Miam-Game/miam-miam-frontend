<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { socket } from "../socket";

const timeLeft = ref(0);
const idPlayer = ref(null);
const score = ref(0);
const gameOverData = ref(null);

const cellSize = 20
const pawnSize = 28
const cakeSize = 28

function center(value, size) {
  return Math.max(0, value * cellSize + cellSize/2 - size/2)
}



socket.on("timeLeft", value => {
  timeLeft.value = value;
});

const props = defineProps({
  playerInfo: Object
});

socket.on("gameOver", data => {
  gameOverData.value = data;
});


// gameState envoyé par le serveur
const gameState = ref({
  players: [] // [{ num, username, color, x, y }]
});

const bestPlayer = computed(() => {
  if (!gameState.value.players.length) return null;

  return [...gameState.value.players].sort((a, b) => b.score - a.score)[0];
});


function handleKey(e) {
  if (e.key === "ArrowUp") socket.emit("move", { direction: "ArrowUp" });
  if (e.key === "ArrowDown") socket.emit("move", { direction: "ArrowDown" });
  if (e.key === "ArrowLeft") socket.emit("move", { direction: "ArrowLeft" });
  if (e.key === "ArrowRight") socket.emit("move", { direction: "ArrowRight" });
}

onMounted(() => {
  window.addEventListener("keydown", handleKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKey);
});


// écoute du serveur
socket.on("gameState", state => {
  gameState.value = state;
});
</script>

<template>
  <div class="game-wrapper">

    <div class="timer">{{ timeLeft }} s</div>

    <!-- 🟦 Zone de jeu -->
    <div class="game-area">
      <div class="board">
        <!-- Pions -->
        <div
          v-for="p in gameState.players"
          class="pawn"
          :style="{
            left: center(p.x, pawnSize) + 'px',
            top: center(p.y, pawnSize) + 'px',
            backgroundColor: p.color
          }"
        ></div>



        <!-- Cakes (cupcakes) -->
        <img
          v-for="(c, index) in gameState.cakes"
          :key="'cake-' + index"
          src="/cupcake.webp"
          class="cake"
          :style="{
            left: center(c.x, cakeSize) + 'px',
            top: center(c.y, cakeSize) + 'px'
          }"
        />

      </div>

    </div>

    <!-- 🟧 Infos du joueur -->
    <div class="sidebar">
      <div v-if="bestPlayer" class="best-score">
        <h3>Meilleur score</h3>
        <p>
          <span class="dot" :style="{ backgroundColor: bestPlayer.color }"></span>
          {{ bestPlayer.username }} — {{ bestPlayer.score }}
        </p>
      </div>

      <h3>Ton joueur</h3>
      <p>Numéro : {{ props.playerInfo.playerNumber }}</p>
      <p>Pseudo : {{ props.playerInfo.username }}</p>
      <p>
        Couleur :
        <span class="dot" :style="{ backgroundColor: props.playerInfo.color }"></span>
      </p>

      <h3>Joueurs</h3>
      <div class="players-wrapper">
        <div
          v-for="p in gameState.players"
          :key="p.num"
          class="player-row"
        >
          <span class="dot" :style="{ backgroundColor: p.color }"></span>
          <span class="name">{{ p.username }}</span>
          <span class="score">{{ p.score }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 🌌 ÉCRAN DE JEU PLEIN ÉCRAN */
.game-wrapper {
  position: fixed;
  inset: 0;

  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(135deg, #fdf4ff, #fce7f3);
}

/* ⏱ TIMER */
.timer {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);

  background: linear-gradient(135deg, #f472b6, #8b5cf6);
  color: white;

  padding: 10px 18px;
  border-radius: 999px;

  font-size: 1.4rem;
  font-weight: bold;

  box-shadow: 0 6px 0 #6d28d9;
  z-index: 10;
}

/* 🎮 CONTENU CENTRAL (plateau + sidebar) */
.game-area {
  display: flex;
  gap: 48px; /* ou 60px si tu veux encore plus d’espace */
  align-items: center;
}

.sidebar h3 {
  margin: 4px 0 2px 0; /* réduit fortement l’espace */
  font-size: 1.1rem;
  color: #6b21a8;;
}

.sidebar p {
  margin: 2px 0;
  line-height: 1.2;
}


/* 🧱 PLATEAU */
.board {
  width: 400px;
  height: 400px;
  position: relative;

  background:
    repeating-linear-gradient(
      0deg,
      #fdf4ff 0,
      #fdf4ff 19px,
      #e9d5ff 20px
    ),
    repeating-linear-gradient(
      90deg,
      #fdf4ff 0,
      #fdf4ff 19px,
      #e9d5ff 20px
    );

  border: 6px solid #6b21a8;
  border-radius: 16px;
  box-shadow: 0 12px 0 #4c1d95;

  overflow: hidden;
}

/* 🧍 PIONS */
.pawn {
  width: 20px;
  height: 20px;
  position: absolute;

  border-radius: 6px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.4);
}

/* 🍰 CAKES */
.cake {
  width: 25px;
  height: 25px;
  position: absolute;
  object-fit: contain;
  pointer-events: none;
}


/* 🟪 SIDEBAR */
.sidebar {
  width: 460px;
  height: 450px;
  padding: 16px;
  margin-left: 20px;

  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;

  border: 3px solid #f0abfc;
  box-shadow: 0 8px 0 #d946ef;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 🏆 MEILLEUR SCORE */
.best-score {
  padding: 10px;
  border-radius: 12px;

  background: linear-gradient(135deg, #f472b6, #a855f7);
  color: white;

  box-shadow: 0 6px 0 #6d28d9;
}
.players-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;     /* 🔥 centre tout dans la sidebar */
  width: 100%;
  gap: 6px;
}

.player-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 90%;              /* 🔥 empêche de dépasser la sidebar */
  max-width: 220px;        /* optionnel : limite la largeur */
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}

.player-row .name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-row .score {
  font-weight: 600;
  color: #444;
  min-width: 40px;
  text-align: right;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-block;
  border: 2px solid #fff;
  box-shadow: 0 0 4px rgba(0,0,0,0.2);
  flex-shrink: 0;
}



.score {
  font-size: 13px;
  color: #666;
}


</style>