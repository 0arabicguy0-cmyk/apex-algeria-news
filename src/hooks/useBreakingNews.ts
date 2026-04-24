import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export interface BreakingItem {
  id: string;
  text: string;
  link_article_id: string | null;
}

type Row = Tables<"breaking_news_items">;

export function useBreakingNews() {
  const [items, setItems] = useState<BreakingItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from("breaking_news_items")
        .select("id, text, link_article_id, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (!cancelled) {
        setItems(
          (data ?? []).map((r) => ({
            id: r.id,
            text: r.text,
            link_article_id: r.link_article_id,
          }))
        );
      }
    }
    load();

    const channel = supabase
      .channel("breaking_news_items-public")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "breaking_news_items" },
        () => load()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return items;
}
