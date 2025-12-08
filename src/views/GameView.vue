<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";

const socket = io("http://localhost:4500");

/* --- Canvas --- */
const canvas = ref(null);
const WIDTH = 400;
const HEIGHT = 400;
const CELL = 20;

/* --- Etat du jeu --- */
const game = reactive({
  players: [],
  cakes: [],
  timeLeft: null,
});

/* --- Réception serveur --- */
socket.on("gameStart", data => {
  game.players = data.players;
  game.cakes = data.cakes;
  game.timeLeft = data.timeLeft;
});

socket.on("gameState", data => {
  game.players = data.players;
  game.cakes = data.cakes;
});

socket.on("timer", time => {
  game.timeLeft = time;
});

socket.on("gameEnd", data => {
  alert(
    "Fin de partie\n" +
    data.results.map(r => `${r.username} : ${r.score}`).join("\n")
  );
});

/* --- Clavier --- */
function onKeyDown(e) {
  const allowed = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (allowed.includes(e.key)) {
    socket.emit("move", { direction: e.key });
  }
}

/* --- Dessin --- */
function draw() {
  const ctx = canvas.value.getContext("2d");

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // fond
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // gâteaux
  ctx.fillStyle = "pink";
  for (const cake of game.cakes) {
    ctx.fillRect(cake.x * CELL, cake.y * CELL, CELL, CELL);
  }

  // joueurs
  for (const p of game.players) {
    ctx.fillStyle = "#3498db";
    ctx.fillRect(p.x * CELL, p.y * CELL, CELL, CELL);

    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText(
      `${p.username} (${p.score})`,
      p.x * CELL,
      p.y * CELL - 2
    );
  }

  requestAnimationFrame(draw);
}

/* --- Lifecycle --- */
onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
  draw();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
  <div class="game">
    <div class="hud">
      ⏱ Temps restant : {{ game.timeLeft ?? "..."}}
    </div>

    <canvas
      ref="canvas"
      :width="WIDTH"
      :height="HEIGHT"
      class="board"
    />
  </div>
</template>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.board {
  border: 2px solid black;
}

.hud {
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
