import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthError = {
  message: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error) return false;

    return data?.role === "admin";
  };

  const refreshAdminExists = async () => {
    const { data, error } = await supabase.rpc("admin_exists");
    if (error) return null;
    setAdminExists(Boolean(data));
    return Boolean(data);
  };

  useEffect(() => {
    refreshAdminExists();
  }, []);


  useEffect(() => {
    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const admin = await checkAdminRole(session.user.id);
        setIsAdmin(admin);

        if (!admin) {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
        }
      }

      setLoading(false);
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ??null);

      if (session?.user) {
        const admin = await checkAdminRole(session.user.id);
        setIsAdmin(admin);

        if (!admin) {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: {
          message: "Unable to retrieve authenticated user.",
        } satisfies AuthError,
      };
    }

    const admin = await checkAdminRole(user.id);

    if (!admin) {
      await supabase.auth.signOut();

      return {
        error: {
          message: "You are not authorized to access the admin panel.",
        } satisfies AuthError,
      };
    }

    setUser(user);
    setIsAdmin(true);

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();

    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const signUp = async (email: string, password: string) => {
    // Only allowed while no admin account exists yet (first-time setup).
    const exists = await refreshAdminExists();

    if (exists !== false) {
      return {
        error: {
          message: "Registration is disabled — an administrator already exists.",
        } satisfies AuthError,
        needsEmailConfirmation: false,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin/login` },
    });

    if (error) return { error, needsEmailConfirmation: false };

    await refreshAdminExists();

    if (!data.session) {
      return { error: null, needsEmailConfirmation: true };
    }

    const admin = data.user ? await checkAdminRole(data.user.id) : false;
    setUser(data.user ?? null);
    setSession(data.session);
    setIsAdmin(admin);

    return { error: null, needsEmailConfirmation: false };
  };

  return {
    user,
    session,
    isAdmin,
    adminExists,
    refreshAdminExists,
    isPublisher: isAdmin,
    isReviewer: isAdmin,
    isJournalist: isAdmin,
    role: isAdmin ? "admin" : null,
    loading,
    signIn,
    signOut,

    signUp,
  };
}