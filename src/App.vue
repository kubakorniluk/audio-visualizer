<script setup>
  import { onMounted } from 'vue';
  import { useTracksStore } from './stores/tracks';
  import Player from './components/Player.vue';
  import Browser from './components/Browser.vue';
  import Navbar from './components/Navbar.vue';

  const store = useTracksStore();

  onMounted(() => {
    store.setTracks();
    
  })
</script>

<template>
  <Navbar />
  <main class="main">
    <Browser />
    <Player />
  </main>
</template>

<style scoped>
  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>
