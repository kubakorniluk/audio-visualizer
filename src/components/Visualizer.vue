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

// Jeden kontekst audio dla całej aplikacji
const audioContext = ref(null);
const analyser = ref(null);
const audioSources = ref(new Map()); // Mapa do przechowywania źródeł dla każdej ścieżki
let animationId = null;
const canvas = ref(null);
let ctx;

// Inicjalizacja kontekstu audio
const initAudioContext = () => {
    if (!audioContext.value) {
        audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
        analyser.value = audioContext.value.createAnalyser();
        analyser.value.fftSize = 2048;
    }
};

// Przygotowanie źródeł dla wszystkich ścieżek audio
const prepareAudioSource = (audioElement) => {
    if (!audioElement) return;
    
    // Weryfikacja, czy element to HTMLAudioElement
    if (!(audioElement instanceof HTMLAudioElement)) {
        console.error("Element is not an HTMLAudioElement");
        return;
    }
    
    // Inicjalizacja kontekstu audio, jeśli jeszcze nie istnieje
    initAudioContext();
    
    // Sprawdź, czy już mamy źródło dla tego elementu audio
    if (!audioSources.value.has(audioElement)) {
        try {
            // Utwórz nowe źródło dla tego elementu audio
            const source = audioContext.value.createMediaElementSource(audioElement);
            // Zapisz źródło w mapie
            audioSources.value.set(audioElement, source);
            console.log("Created new audio source for track");
        } catch (error) {
            console.error("Error creating media element source:", error);
        }
    }
};

// Aktywacja wizualizera dla bieżącej ścieżki
const activateVisualizer = (audioElement) => {
    if (!audioElement || !audioContext.value || !analyser.value) return;
    
    // Zatrzymaj poprzednią animację
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // Najpierw odłącz wszystkie źródła od analizatora
    for (const source of audioSources.value.values()) {
        source.disconnect();
    }
    
    // Pobierz źródło dla bieżącego elementu audio
    const source = audioSources.value.get(audioElement);
    
    if (source) {
        // Podłącz tylko bieżące źródło do analizatora
        source.connect(analyser.value);
        analyser.value.connect(audioContext.value.destination);
        
        // Rozpocznij wizualizację
        if (ctx) {
            drawVisualizer();
        }
        
        console.log("Activated visualizer for current track");
    }
};

// Inicjalizacja źródeł dla wszystkich dostępnych ścieżek
const initializeAllTracks = () => {
    // Pobierz wszystkie ścieżki ze store
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
    
    // Czyść canvas
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    
    // Rysowanie wizualizacji
    const barWidth = (canvas.value.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    
    // Pozycja w spektrum i intensywność
    const intensity = dataArray[i] / 255;
    const position = i / bufferLength;
    
    // Gradient od czerwieni do fioletu/niebieskiego
    const r = Math.floor(220 * (1 - position) + 88 * position); // Od 220 do 88
    const g = Math.floor(50 * (1 - position) + 76 * position);  // Od 50 do 76
    const b = Math.floor(100 * (1 - position) + 234 * position); // Od 100 do 234
    
    // Modyfikacja intensywności w zależności od głośności
    const finalR = Math.floor(r * (0.4 + intensity * 0.6));
    const finalG = Math.floor(g * (0.4 + intensity * 0.6));
    const finalB = Math.floor(b * (0.4 + intensity * 0.6));
    
    ctx.fillStyle = `rgb(${finalR},${finalG},${finalB})`;
    ctx.fillRect(x, canvas.value.height - barHeight / 2, barWidth, barHeight);
    
    x += barWidth + 1;
}
    
    // Animacja
    animationId = requestAnimationFrame(drawVisualizer);
};

// Obserwuj zmiany bieżącej ścieżki
watch(currentTrack, (newTrack) => {
    if (newTrack) {
        // Upewnij się, że mamy źródło dla tej ścieżki
        prepareAudioSource(newTrack);
        // Aktywuj wizualizację dla bieżącej ścieżki
        activateVisualizer(newTrack);
    }
}, { immediate: true });

onMounted(() => {
    if (canvas.value) {
        ctx = canvas.value.getContext('2d');
        
        // Inicjalizuj kontekst audio
        initAudioContext();
        
        // Inicjalizuj wszystkie dostępne ścieżki
        initializeAllTracks();
        
        // Aktywuj wizualizator dla bieżącej ścieżki, jeśli istnieje
        if (currentTrack.value) {
            activateVisualizer(currentTrack.value);
        }
    }
});

// Czyszczenie zasobów przed odmontowaniem komponentu
onBeforeUnmount(() => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Odłącz wszystkie źródła
    for (const source of audioSources.value.values()) {
        source.disconnect();
    }
    
    // Wyczyść mapę źródeł
    audioSources.value.clear();
    
    // Zamknij kontekst audio
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