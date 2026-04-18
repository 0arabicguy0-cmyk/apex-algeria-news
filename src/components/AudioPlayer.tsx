import { useEffect, useRef, useState } from "react";
import { Play, Pause, Square } from "lucide-react";

export default function AudioPlayer({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const start = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.95;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setPlaying(true);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setPlaying(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  };

  if (!supported) return null;

  return (
    <div className="flex items-center gap-2 bg-muted/60 rounded-full px-3 py-1.5 text-xs">
      {!playing ? (
        <button onClick={start} className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors">
          <Play className="w-3.5 h-3.5 fill-current" />
          استمع للمقال
        </button>
      ) : (
        <>
          <button onClick={pause} className="flex items-center gap-1 text-primary">
            <Pause className="w-3.5 h-3.5 fill-current" />
            إيقاف مؤقت
          </button>
          <button onClick={stop} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </>
      )}
    </div>
  );
}
