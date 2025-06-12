<script setup>
    import { useTracksStore } from '@/stores/tracks';
    import Tracks from './Tracks.vue';

    const store = useTracksStore();
    // const totalTracks = computed(() => {
    //     if (store.getTracks) {
    //         return store.getTracks.length;
    //     } else { return '0'}
    // })
    // const currentTrack = computed(() => {
    //     if (store.getCurrentTrack) {
    //         return store.getCurrentTrack.id
    //     } else { return '0'}
    // })
</script>

<template>
    <div class="browser">
        <Tracks />
    </div>
</template>

<style scoped>
    .browser {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        /* background: linear-gradient(
            135deg, 
            rgba(10, 11, 12, 1) 0%, 
            rgba(10, 11, 28, 1) 20%, 
            rgba(25, 22, 65, .8) 45%, 
            rgba(45, 38, 115, .8) 75%, 
            rgba(88, 76, 234, .6) 100%
        ); */
        overflow-x: hidden;
        background-color: var(--black-300)
    }
</style>