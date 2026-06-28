// src/hooks/useVideos.ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Video {
  id: string;
  title: string;
  thumbnail: string;      // video thumbnail URL (first frame or uploaded)
  category: string;
  type: "video";          // fixed to differentiate from articles
  // add any other fields your videos table has, e.g.:
  // description?: string;
  // url?: string;        // video file URL
  // duration?: number;
  // created_at?: string;
}

export function useVideosByIds(ids: string[]): Video[] {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setVideos([]);
      return;
    }

    let cancelled = false;

    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .in("id", ids);

      if (cancelled) return;

      if (error) {
        console.error("Error fetching videos:", error);
        setVideos([]);
        return;
      }

      // Map each video to include type: 'video'
      const typedVideos = (data || []).map((video) => ({
        ...video,
        type: "video" as const,
        // ensure thumbnail field exists; fallback to a default if needed
        thumbnail: video.thumbnail || video.image || "",
      }));

      setVideos(typedVideos);
    };

    fetchVideos();

    return () => {
      cancelled = true;
    };
  }, [ids.join(",")]); // re-run when IDs change

  return videos;
}