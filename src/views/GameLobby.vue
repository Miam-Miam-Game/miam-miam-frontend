<script setup>
import { ref } from "vue";
import { socket } from "../socket";
import logo from "@/assets/logo.gif";

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
  <div class="lobby-bg">
    <img :src="logo" alt="Logo du jeu" class="game-logo" />

    <div class="container">

      <!-- Entrée pseudo -->
      <div v-if="!props.joined">
        <h2>Entrer votre pseudo</h2>
          <input
            v-model="username"
            placeholder="Pseudo"
            class="pseudo-input"
          />

          <button
            @click="joinGame"
            class="join-button"
          >
            Rejoindre
          </button>
      </div>

      <!-- Salle d’attente -->
      <div v-else class="waiting-room">

        <h2 class="waiting-title">Salle d’attente</h2>

        <div class="players-count">
          {{ props.players.length }} / 3 joueurs
        </div>

        <ul class="players-list">
          <li
            v-for="p in props.players"
            :key="p"
            class="player-card"
          >
          <span
            class="pixel-dot"
            :style="{ '--player-color': p.color }"
          ></span>
            Joueur {{ p.num }} - {{ p.username }}
          </li>

          <!-- Slots vides -->
          <li
            v-for="n in 3 - props.players.length"
            :key="'empty-' + n"
            class="player-card empty"
          >
            En attente...
          </li>
        </ul>

        <div
          v-if="props.countdown !== null"
          class="countdown-box"
        >
          Début dans
          <span class="countdown-number">{{ props.countdown }}</span>
        </div>

      </div>


    </div>
  </div>
</template>


<style scoped>

  /* TITRE */
h2 {
  text-align: center;
  margin-bottom: 15px;
  color: #6b21a8;
  font-weight: 700;
}

/* INPUT PSEUDO */
.pseudo-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1.1rem;
  border-radius: 12px;

  border: 3px solid #f0abfc;
  outline: none;

  background: #fff;
  color: #4c1d95;

  box-shadow: 0 4px 0 #d946ef;
  transition: all 0.15s ease;
}

.pseudo-input::placeholder {
  color: #c084fc;
}

/* Focus arcade */
.pseudo-input:focus {
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.4);
}

/* BOUTON */
.join-button {
  width: 100%;
  margin-top: 15px;
  padding: 12px;

  font-size: 1.2rem;
  font-weight: bold;

  border-radius: 14px;
  border: none;

  cursor: pointer;

  color: white;
  background: linear-gradient(135deg, #f472b6, #8b5cf6);

  box-shadow: 0 6px 0 #6d28d9;
  transition: all 0.15s ease;
}

/* Effet bouton jeu */
.join-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 0 #6d28d9;
}

.join-button:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #6d28d9;
}

.lobby-bg {
  position: fixed;
  inset: 0;          /* top:0 left:0 right:0 bottom:0 */
  width: 100vw;
  height: 100vh;

  background-image: url('@/assets/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}


.game-logo {
  width: 350px;
  margin-bottom: 20px;
}

.container {
  background: rgb(255 255 255 / 39%);
  padding: 20px;
  border-radius: 10px;
}

.countdown {
  margin-top: 20px;
  font-size: 2rem;
  font-weight: bold;
}

/* CONTENEUR SALLE D'ATTENTE */
.waiting-room {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

/* TITRE */
.waiting-title {
  font-size: 1.6rem;
  color: #6b21a8;
}

/* COMPTEUR JOUEURS */
.players-count {
  background: linear-gradient(135deg, #f472b6, #a855f7);
  color: white;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: bold;
  box-shadow: 0 4px 0 #6d28d9;
}

/* LISTE DES JOUEURS */
.players-list {
  list-style: none;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* CARTE JOUEUR */
.player-card {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 14px;
  border-radius: 12px;

  background: #fdf4ff;
  color: #4c1d95;
  font-weight: bold;

  border: 3px solid #f0abfc;
  box-shadow: 0 4px 0 #d946ef;
}

/* SLOT VIDE */
.player-card.empty {
  opacity: 0.6;
  font-style: italic;
}

/* PETIT POINT PIXEL */
.pixel-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;

  background: var(--player-color, #f472b6);

  box-shadow: 0 0 0 2px
    color-mix(in srgb, var(--player-color, #f472b6), black 20%);
}


/* COMPTE À REBOURS */
.countdown-box {
  margin-top: 10px;
  padding: 10px 16px;
  border-radius: 14px;

  background: linear-gradient(135deg, #8b5cf6, #f472b6);
  color: white;

  font-size: 1.2rem;
  font-weight: bold;

  box-shadow: 0 6px 0 #6d28d9;
}

.countdown-number {
  font-size: 1.6rem;
  margin-left: 6px;
}

</style>

