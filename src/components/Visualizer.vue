<script setup>
import { useTracksStore } from '@/stores/tracks';
import { 
  computed, 
  watch, 
  onMounted, 
  ref, 
  onBeforeUnmount 
} from 'vue';

const store = useTracksStore();
const currentTrack = computed(() => {
    console.log("Current track from store:", store.getCurrentTrack);
    return store.getCurrentTrack?.audio ?? null;
});


const audioContext = ref(null);
const analyser = ref(null);
const audioSources = ref(new Map()); 
let animationId = null;
const canvas = ref(null);
let ctx;


const initAudioContext = () => {
    if (!audioContext.value) {
        audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
        analyser.value = audioContext.value.createAnalyser();
        analyser.value.fftSize = 2048;
    }
};


const prepareAudioSource = (audioElement) => {
    if (!audioElement) return;
    
   
    if (!(audioElement instanceof HTMLAudioElement)) {
        console.error("Element is not an HTMLAudioElement");
        return;
    }
    
    
    initAudioContext();
    
    
    if (!audioSources.value.has(audioElement)) {
        try {
            
            const source = audioContext.value.createMediaElementSource(audioElement);
           
            audioSources.value.set(audioElement, source);
            console.log("Created new audio source for track");
        } catch (error) {
            console.error("Error creating media element source:", error);
        }
    }
};

const activateVisualizer = (audioElement) => {
    if (!audioElement || !audioContext.value || !analyser.value) return;
    

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
   
    for (const source of audioSources.value.values()) {
        source.disconnect();
    }
    

    const source = audioSources.value.get(audioElement);
    
    if (source) {
       
        source.connect(analyser.value);
        analyser.value.connect(audioContext.value.destination);
        
        
        if (ctx) {
            drawVisualizer();
        }
        
        console.log("Activated visualizer for current track");
    }
};


const initializeAllTracks = () => {
    
    const allTracks = store.getTracks;
    
    if (allTracks && allTracks.length > 0) {
        allTracks.forEach(track => {
            if (track.audio) {
                prepareAudioSource(track.audio);
            }
        });
        console.log("Initialized sources for all tracks");
    }
};

const drawVisualizer = () => {
    if (!analyser.value) return;
    
    const bufferLength = analyser.value.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.value.getByteFrequencyData(dataArray);
    
    
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    
    
    const barWidth = (canvas.value.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    
    
    const intensity = dataArray[i] / 255;
    const position = i / bufferLength;
    
    
    const r = Math.floor(220 * (1 - position) + 88 * position); // Od 220 do 88
    const g = Math.floor(50 * (1 - position) + 76 * position);  // Od 50 do 76
    const b = Math.floor(100 * (1 - position) + 234 * position); // Od 100 do 234
    
    
    const finalR = Math.floor(r * (0.4 + intensity * 0.6));
    const finalG = Math.floor(g * (0.4 + intensity * 0.6));
    const finalB = Math.floor(b * (0.4 + intensity * 0.6));
    
    ctx.fillStyle = `rgb(${finalR},${finalG},${finalB})`;
    ctx.fillRect(x, canvas.value.height - barHeight / 2, barWidth, barHeight);
    
    x += barWidth + 1;
}
    
   
    animationId = requestAnimationFrame(drawVisualizer);
};


watch(currentTrack, (newTrack) => {
    if (newTrack) {
       
        prepareAudioSource(newTrack);
        
        activateVisualizer(newTrack);
    }
}, { immediate: true });

onMounted(() => {
    if (canvas.value) {
        ctx = canvas.value.getContext('2d');
        
        
        initAudioContext();
        
        
        initializeAllTracks();
        
        
        if (currentTrack.value) {
            activateVisualizer(currentTrack.value);
        }
    }
});


onBeforeUnmount(() => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    

    for (const source of audioSources.value.values()) {
        source.disconnect();
    }
    

    audioSources.value.clear();
    

    if (audioContext.value && audioContext.value.state !== 'closed') {
        audioContext.value.close();
    }
});
</script>

<template>
  <canvas class="visualizer" ref="canvas" width="600" height="auto"></canvas>
</template>

<style scoped>
  .visualizer {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 0;
    height: 15vh;
    width: 100%;
    background: none;
    
  }
</style>