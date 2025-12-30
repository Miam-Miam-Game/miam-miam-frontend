<script setup>
import { ref, onMounted } from "vue";
import { socket } from "../socket";

const props = defineProps({
  playerInfo: Object
});

const gameState = ref({ players: [], cakes: [] });

socket.on("gameState", state => {
  gameState.value = state;
});

onMounted(() => {
  console.log("🎮 GameView monté avec :", props.playerInfo);
});
</script>

<template>
  <div>
    <h2>Bienvenue dans le jeu !</h2>

    <p>Tu es : Joueur {{ props.playerInfo.playerNumber }}</p>
    <p>Pseudo : {{ props.playerInfo.username }}</p>
    <p>Couleur : <span :style="{color: props.playerInfo.color}">●</span></p>

    <!-- Ici tu mets ton canvas -->
  </div>
</template>
