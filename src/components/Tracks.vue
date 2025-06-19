<script setup>
    import LoadMore from './LoadMore.vue';
    import { useTracksStore } from '@/stores/tracks';
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { 
        faFileWaveform, 
        faPlay, 
        faPause, 
        faClock, 
        faHashtag
    } from '@fortawesome/free-solid-svg-icons'; 
    library.add(
        faFileWaveform, 
        faPlay, 
        faPause, 
        faClock, 
        faHashtag
    );

    const store = useTracksStore();

</script>

<template>
    <ul class="tracks">
        <li class="header">
            <div style="grid-area: 1 / 1 / 2 / 2;">
                <FontAwesomeIcon :icon="faHashtag"></FontAwesomeIcon>
            </div>
            <div style="grid-area: 1 / 2 / 2 / 3;">
                Title
            </div>
            <div style="grid-area: 1 / 3 / 2 / 4;">
                <FontAwesomeIcon :icon="faClock"></FontAwesomeIcon>
            </div>
            <div style="grid-area: 1 / 4 / 2 / 5; text-align: right;">
                Play
            </div>
        </li>
        
        <li class="track" v-for="track in store.getTracks" :key="track.id"> 

            <div style="grid-area: 1 / 1 / 2 / 2;">
                <FontAwesomeIcon class="track__id" :icon="faFileWaveform"></FontAwesomeIcon>
            </div>
            <div style="grid-area: 1 / 2 / 2 / 3;">
                <p class="track__title">{{ track.name }}</p>
            </div>
            <div style="grid-area: 1 / 3 / 2 / 4;">
                <p class="track__duration">
                    {{ 
                        `${ track.duration.minutes }:${ track.duration.seconds < 10 ? '0' + track.duration.seconds : track.duration.seconds }` 
                    }}
                </p>
            </div>
            <div style="grid-area: 1 / 4 / 2 / 5;">
                <button 
                    class="track__play" 
                    :title="`Play track ${ track.id + 1 }`"
                    @click="() => store.togglePlay(track.id)" 
                >
                    <FontAwesomeIcon
                        class="track__icon" 
                        :icon="store.isPlaying(track.id) ? faPause : faPlay" 
                    />
                </button>
            </div>
        </li>
        <LoadMore></LoadMore>
    </ul>

</template>

<style scoped>
    .tracks {
        display: flex;
        flex-direction: column;
        width: calc(100% - 6rem);
        height: 100%;
        margin: 0;
        padding: 0rem 3rem;
        overflow-y: auto;
        
    }
    .track, 
    .header {
        display: grid;
        grid-template-columns: 10% 65% 15% 10%;
        grid-template-rows: auto repeat(4, 1fr);
        grid-column-gap: 0;
        grid-row-gap: 0;
        /* more padding for scroll simulation */
        padding: 2rem 2rem;
    }
    .header div {
        margin: 0;
        padding: 0;
        color: var(--slategray);
        font: var(--p-500-09)
    }
    .track {
        align-items:center;
        background-color: transparent;
        border-radius: 4px;
        transition: background-color 0.3s;
        margin: 0;
        .track__id {
            color: var(--slategray);
            font-size: 1.2rem;
        }
        .track__title {
            color: var(--white);
            margin: 0;
            padding: 0;
            font: var(--p-400-09)
        }
        .track__duration {
            color: var(--slategray);
            margin: 0;
            padding: 0;
            font: var(--p-500-09)
        }
        .track__play {
            float: right;
            margin: 0;
            padding: 0;
            border: none;
            background: none;
        }
        .track__icon {
            color: var(--white);
            font-size: 1.2rem;
            cursor: pointer;
        }
    }

    .track:hover {
        background-color: var(--dark-blue-150);
        box-shadow: 0px 0px 20px var(--dark-blue-150) inset;
    }
</style>