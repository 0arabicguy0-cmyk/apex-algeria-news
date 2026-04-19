import { useEffect, useState } from "react";
import { subscriptionApi } from "@/lib/mockStore";

export function useSubscription() {
  const [active, setActive] = useState(subscriptionApi.isActive());

  useEffect(() => {
    const sync = () => setActive(subscriptionApi.isActive());
    window.addEventListener("apex-subscription", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("apex-subscription", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    active,
    subscribe: () => subscriptionApi.subscribe(),
    cancel: () => subscriptionApi.cancel(),
  };
}
