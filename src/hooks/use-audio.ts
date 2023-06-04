import { useRef, useState } from "react";

export function useAudio(audioName: string, volume?: number) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(
    mountAudio({ audioName, onStop: () => setIsPlayingAudio(false), volume })
  );

  async function playAudio() {
    try {
      await audioRef.current.play();
      setIsPlayingAudio(true);
    } catch {
      console.log("[audio] Unable to play audio");
    }
  }

  function stopAudio() {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlayingAudio(false);
  }

  return {
    isPlayingAudio,
    playAudio,
    stopAudio,
  };
}

function mountAudio(params: {
  audioName: string;
  onStop: Function;
  volume?: number;
}) {
  if (typeof window === "undefined") {
    return null;
  }

  const audio = new Audio(`/sounds/${params.audioName}`);

  audio.onended = () => params.onStop();

  audio.volume = typeof params.volume === "undefined" ? 1 : params.volume;

  return audio;
}
