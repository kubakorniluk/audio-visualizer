<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useTracksStore } from '@/stores/tracks';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
    faForwardStep, 
    faBackwardStep, 
    faPlay, 
    faPause, 
    faCircle,
    faVolumeXmark,
    faVolumeOff,
    faVolumeLow,
    faVolumeHigh 
} from '@fortawesome/free-solid-svg-icons';
import Visualizer from './Visualizer.vue';

library.add(
    faForwardStep, 
    faBackwardStep, 
    faPlay, 
    faPause, 
    faCircle,
    faVolumeXmark,
    faVolumeOff,
    faVolumeLow,
    faVolumeHigh 
);

const store = useTracksStore();

const time = ref('0:00');

// Reaktywny pasek postępu
const progress = computed(() => {
    const track = store.getCurrentTrack;
    if (track && track.duration.total > 0) {
        return (track.currentTime.total / track.duration.total) * 100;
    }
    return 0;
});

const checkIsPlaying = () => {
    if (store.getCurrentTrack && store.getCurrentTrack.id !== undefined) {
        return store.isPlaying(store.getCurrentTrack.id);
    }
}

const checkDuration = () => {
    if (store.getCurrentTrack ) {
        return `${store.getCurrentTrack.duration.minutes}:${store.getCurrentTrack.duration.seconds < 10 ? '0' + store.getCurrentTrack.duration.seconds : store.getCurrentTrack.duration.seconds}`;
    } else { return '0:00' }
}

// Aktualizuj czas odtwarzania na bieżąco
watch(
    () => store.getCurrentTrack && store.getCurrentTrack.currentTime.total,
    (newTime) => {
        if (store.getCurrentTrack) {
            time.value = `${store.getCurrentTrack.currentTime.minutes}:${store.getCurrentTrack.currentTime.seconds < 10 ? '0' + store.getCurrentTrack.currentTime.seconds : store.getCurrentTrack.currentTime.seconds}`;
        }
    }
);

</script>

<template>
    <footer class="player">
        <div class="progress">
            <Visualizer></Visualizer>
            <div class="progress-bar" :style="{ width: progress + '%' }">
                <FontAwesomeIcon 
                    class="progress-bar__icon" 
                    :icon="faCircle" 
                ></FontAwesomeIcon>
            </div>
        </div>
        <div class="settings">
            <div class="controls">
                <span class="controls__time">{{ time }}</span>
                <button class="controls__button" @click="() => store.prevTrack()">
                    <FontAwesomeIcon 
                        class="controls__button--icon" 
                        :icon="faBackwardStep" 
                        style="font-size: 1.5rem"
                    ></FontAwesomeIcon>
                </button>
                <button class="controls__button" @click="() => store.togglePlay(store.getCurrentTrack.id)">
                    <FontAwesomeIcon 
                        class="controls__button--icon" 
                        :icon="checkIsPlaying() ? faPause : faPlay"
                    ></FontAwesomeIcon>
                </button>
                <button class="controls__button" @click="() => store.nextTrack()">
                    <FontAwesomeIcon 
                        class="controls__button--icon" 
                        :icon="faForwardStep" 
                        style="font-size: 1.5rem"
                    ></FontAwesomeIcon>
                </button>
                <span class="controls__time">{{ checkDuration()  }}</span>
            </div>
        </div>
    </footer>
</template>

<style scoped>
    .player {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 1rem 0;
        background-color: var(--black-600);
        backdrop-filter: blur(10px);
    }
    .progress {
        position: absolute;
        top: 0;
        left: 0;
        background-color: var(--light-black);
        width: 100%;
        .progress-bar {
            position: relative;
            width: 0%;
            height: 4px;
            background-color: var(--purple);
            transition: width 0.2s linear;
            .progress-bar__icon {
                color: var(--purple);
                position: absolute;
                top: -6px;
                right: -4px;
                font-size: 1rem;
            }
        }
    }
    .settings {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    .controls {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin: 0;
        .controls__time {
            color: var(--slategray);
            font: var(--p-500-09);
        }
        .controls__button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            margin: 0;
            border-radius: 8px;
            transition: background-color 0.3s;
            &:hover {
                background-color: var(--dark-purple-600);
                box-shadow: 0px 0px 20px var(--dark-purple-600) inset;
            }
            .controls__button--icon {
                font-size: 2rem;
                padding: 1rem;
                color: var(--white);
            }
        }
    }
</style>