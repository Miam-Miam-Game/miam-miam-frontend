<script setup>
import { computed } from "vue";

const props = defineProps({
  isTie: Boolean,
  winners: Array,
  bestPlayer: Object,
  players: Array,
  isRecord: Boolean,
  bestRecord: Object
});

const sortedPlayers = computed(() =>
  [...props.players].sort((a, b) => b.score - a.score)
);
</script>


<template>
  <div class="winner-wrapper">
    <div class="winner-screen">
      <h1 class="title">🏆 Fin du jeu !</h1>
      
      <!-- 🟥 Cas 1 : Aucun gagnant (tout le monde a 0) -->
      <div v-if="bestPlayer === null" class="winner-card">
        <h2>Aucun gagnant</h2>
        <p>Tous les joueurs ont 0 point.</p>
      </div>

      <!-- 🟩 Cas 2 : Un seul gagnant -->
      <div v-else-if="!isTie" class="winner-card">
        <h2>Vainqueur</h2>
        <p class="winner-name">{{ bestPlayer.username }}</p>
        <p class="winner-score">Score : {{ bestPlayer.score }}</p>
      </div>

      <!-- 🟦 Cas 3 : Égalité -->
      <div v-else class="winner-card tie-card">
        <h2>Égalité !</h2>
        <p class="tie-subtitle">Les joueurs suivants sont ex æquo :</p>

        <ul class="tie-list">
          <li v-for="w in winners" :key="w.idPlayer">
            <span class="pixel-dot" :style="{ '--player-color': w.color }"></span>
            {{ w.username }} — {{ w.score }} pts
          </li>
        </ul>
      </div>

      <!-- Record -->
      <div v-if="isRecord && bestPlayer" class="record-beaten">
        🎉 Nouveau record battu !
        <br />
        Nouveau record : {{ bestPlayer.username }} - {{ bestPlayer.score }} pts
      </div>

      <div v-else-if="bestRecord" class="record-info">
        Record actuel : {{ bestRecord.username }} - {{ bestRecord.score }} pts
      </div>

      <div v-else class="record-info">
        Aucun record enregistré pour le moment.
      </div>


      <!-- Classement -->
      <h3 class="ranking-title">Classement</h3>
      <ul class="ranking-list">
        <li v-for="p in sortedPlayers" :key="p.idPlayer">
          <span class="pixel-dot" :style="{ '--player-color': p.color }"></span>
          {{ p.username }}
          <span class="score">{{ p.score }}</span>
        </li>
      </ul>

      <button class="restart-btn" @click="$emit('restart')">
        Rejouer
      </button>
    </div>
  </div>

</template>


<style>
.winner-wrapper {
  position: fixed;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #fdf4ff, #fce7f3);
}

.tie-card {
  background: #ffeaa7;
  border: 2px dashed #d63031;
}

.tie-subtitle {
  font-size: 1rem;
  margin-bottom: 10px;
}

.tie-list {
  list-style: none;
  padding: 0;
  margin: 0;
}


.winner-screen {
  width: 360px;
  padding: 24px;

  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;

  border: 4px solid #f0abfc;
  box-shadow: 0 12px 0 #d946ef;

  text-align: center;
}

/* TITRE */
.title {
  margin-bottom: 16px;
  font-size: 2rem;
  color: #6b21a8;
}

/* VAINQUEUR */
.winner-card {
  background: linear-gradient(135deg, #f472b6, #8b5cf6);
  color: white;

  padding: 16px;
  border-radius: 16px;

  box-shadow: 0 6px 0 #6d28d9;
  margin-bottom: 20px;
}

.winner-name {
  font-size: 1.4rem;
  font-weight: bold;
}

.winner-score {
  font-size: 1.1rem;
}

/* CLASSEMENT */
.ranking-title {
  margin-bottom: 10px;
  color: #6b21a8;
}

.ranking-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.ranking-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 8px 12px;
  margin-bottom: 8px;

  background: #fdf4ff;
  border-radius: 12px;

  border: 3px solid #f0abfc;
  box-shadow: 0 4px 0 #d946ef;

  font-weight: bold;
  color: #4c1d95;
}

/* SCORE À DROITE */
.score {
  font-weight: bold;
}

/* PIXEL DOT */
.pixel-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;

  background-color: var(--player-color, #f472b6);
  box-shadow: 0 0 0 2px
    color-mix(in srgb, var(--player-color, #f472b6), black 20%);
}

/* BOUTON */
.restart-btn {
  width: 100%;
  padding: 12px;

  font-size: 1.2rem;
  font-weight: bold;

  border: none;
  border-radius: 14px;

  cursor: pointer;
  color: white;

  background: linear-gradient(135deg, #f472b6, #a855f7);
  box-shadow: 0 6px 0 #6d28d9;

  transition: transform 0.15s ease;
}

.restart-btn:hover {
  transform: translateY(-2px);
}

.restart-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #6d28d9;
}

.record-beaten {
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #facc15, #f97316);
  color: white;
  border-radius: 12px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 6px 0 #ea580c;
}

.record-info {
  margin-top: 16px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
}

.pixel-dot {
  width: 14px;
  height: 14px;

  border-radius: 3px;
  background-color: var(--player-color);

  display: inline-block;
  flex-shrink: 0;

  box-shadow: 0 0 0 2px
    color-mix(in srgb, var(--player-color), black 20%);

  margin-right: 8px; /* espace entre le jeton et le nom */
}



</style>