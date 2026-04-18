import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BreakingItem {
  id: string;
  text: string;
  link_article_id: string | null;
}

export function useBreakingNews() {
  const [items, setItems] = useState<BreakingItem[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("breaking_news_items")
        .select("id, text, link_article_id")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      setItems(data ?? []);
    })();
  }, []);
  return items;
}
