import { 
  ref, 
  reactive, 
  computed, 
  watch 
} from 'vue'
import { defineStore } from 'pinia'

export const useTracksStore = defineStore('tracks', () => {
  const tracks = ref([])

  const currentTrack = ref(null)

  const getTracks = computed(() => tracks.value)

  const getCurrentTrack = computed(() => currentTrack.value)

  const getCurrentTime = computed(() => currentTrack.value.currentTime)
  const getDuration = computed(() => currentTrack.value.duration)
  const getVolume = computed(() => currentTrack.value.volume)
 
  const setTracks = async () => {
    const files = import.meta.glob('@/assets/audio/*.wav');

    for (const path in files) {
      const fileModule = await files[path]();

      const audio = new Audio(fileModule.default)

      const track = {
        id: tracks.value.length,
        name: path.split('/').pop(),
        src: fileModule.default,
        audio: audio,
        isPlaying: false,
        volume: 1.0,
        currentTime: {
          total: 0,
          minutes: 0,
          seconds: 0
        },
        duration: {
          total: 0,
          minutes: 0,
          seconds: 0
        },
      }
      
      //update track duration
      audio.addEventListener("loadedmetadata", (event) => {
        let duration = audio.duration;
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration % 60);
        track.duration.total = duration;
        track.duration.seconds = seconds;
        track.duration.minutes = minutes;
      });

      // update track position
      audio.addEventListener("timeupdate", () => {
        let time = audio.currentTime;
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        track.currentTime.total = time;
        track.currentTime.seconds = seconds;
        track.currentTime.minutes = minutes;
      });

      audio.load();
      
      // Check if metadata is already loaded
      if (audio.readyState >= 1) {
        let duration = audio.duration;
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration % 60);
        track.duration.seconds = seconds;
        track.duration.minutes = minutes;
      }

      tracks.value.push(track);
      
    }

    currentTrack.value = tracks.value[0];

  }


  const setCurrentTrack = (id) => {
    tracks.value.forEach(track => {
      if (track.id === id) {
        track.isPlaying = !track.isPlaying;
      } else {
        track.isPlaying = false;
      }
    })
    currentTrack.value = tracks.value.find(track => track.id === id);
  }
  

  const play = () => {
    currentTrack.value.audio.play();
  }

  const pause = () => {
    currentTrack.value.audio.pause();
  }

  // const updateDuration = (id, duration) => {
  //   let minutes = Math.floor(duration / 60);
  //   let seconds = Math.floor(duration % 60);

  //   tracks.value[id].duration.seconds = seconds;
  //   tracks.value[id].duration.minutes = minutes;
  // }

  const updateCurrentTime = (id, currentTime) => {
    tracks.value[id].currentTime = currentTime;
  }


  // const updateVolume = (id, volume) => {
  //   tracks.value[id].volume = volume;
  // }

  // const updateIsPlaying = (id, isPlaying) => {
  //   tracks.value[id].isPlaying = isPlaying;
  // }

  const isPlaying = (id) => tracks.value[id].isPlaying;

  const togglePlay = (id) => {
    // const audio = [...document.getElementsByTagName('audio')];
    // const currentAudio = audio.find(audio => audio.id == id);
    // console.log(audio)
    // setCurrentTrack(id);
    // if (isPlaying(id)) {
    //     // console.log(currentAudio)
    //     play();
    //     tracks.value.forEach(track => {
    //         if (track.id != id) {
    //             track.audio.pause();
    //         }
    //     });
    // } else {
    //     pause();
    // }
     tracks.value.forEach(track => {
    if (track.id === id) {
      if (!track.isPlaying) {
        track.audio.play();
        track.isPlaying = true;
      } else {
        track.audio.pause();
        track.isPlaying = false;
      }
    } else {
      track.audio.pause();
      track.isPlaying = false;
    }
  });
  currentTrack.value = tracks.value.find(track => track.id === id);
  }
  const nextTrack = () => {
    let id = currentTrack.value.id + 1;
    if (id >= tracks.value.length) {
      id = 0;
    }
    console.log(currentTrack.value.id)
    togglePlay(id);
  }
  const prevTrack = () => {
    let id = currentTrack.value.id - 1;
    if (id < 0) {
      id = tracks.value.length - 1;
    }
    // setCurrentTrack(id);
    console.log(currentTrack.value.id)
    togglePlay(id);
  }

  return { 
    tracks, 
    currentTrack,
    setTracks,
    isPlaying, 
    getTracks,
    getCurrentTrack,
    setCurrentTrack,
    updateCurrentTime,
    play, pause,
    getCurrentTime,
    getDuration,
    getVolume,
    togglePlay,
    nextTrack,
    prevTrack
  }
});
