import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_FLAG_KEY = "apex_admin_session";

function readAdminFlag(): boolean {
  try {
    return localStorage.getItem(ADMIN_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(readAdminFlag());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track Supabase session for any data-layer calls that still rely on it.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
    });

    // Keep isAdmin in sync across tabs.
    const onStorage = (e: StorageEvent) => {
      if (e.key === ADMIN_FLAG_KEY) setIsAdmin(readAdminFlag());
    };
    window.addEventListener("storage", onStorage);

    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const signIn = async (username: string, password: string) => {
    const expectedUser = import.meta.env.VITE_ADMIN_USERNAME;
    const expectedPass = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!expectedUser || !expectedPass) {
      return { error: { message: "Admin credentials are not configured." } as { message: string } };
    }
    if (username === expectedUser && password === expectedPass) {
      try {
        localStorage.setItem(ADMIN_FLAG_KEY, "1");
      } catch {
        /* ignore */
      }
      setIsAdmin(true);
      return { error: null };
    }
    return { error: { message: "Invalid username or password." } as { message: string } };
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(ADMIN_FLAG_KEY);
    } catch {
      /* ignore */
    }
    setIsAdmin(false);
    await supabase.auth.signOut();
  };

  // signUp kept as a no-op for any legacy callers; registration is disabled.
  const signUp = async () => ({ error: { message: "Registration is disabled." } as { message: string } });

  return {
    user,
    session,
    isAdmin,
    isPublisher: isAdmin,
    isReviewer: isAdmin,
    isJournalist: isAdmin,
    role: isAdmin ? "admin" : null,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
