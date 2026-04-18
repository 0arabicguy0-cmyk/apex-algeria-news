import { useEffect, useState } from "react";
import { breakingApi, subscribe } from "@/lib/mockStore";

export interface BreakingItem {
  id: string;
  text: string;
  link_article_id: string | null;
}

export function useBreakingNews() {
  const [items, setItems] = useState<BreakingItem[]>(breakingApi.active());
  useEffect(() => subscribe(() => setItems(breakingApi.active())), []);
  return items;
}
