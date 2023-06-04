import { useRef, useState } from "react";

export function useAudio(audioName: string) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const inServerSide = typeof window === "undefined";

  const audioRef = useRef<HTMLAudioElement>(
    inServerSide ? null : new Audio(`/sounds/${audioName}`)
  );

  async function playAudio() {
    audioRef.current.onended = () => setIsPlayingAudio(false);

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
