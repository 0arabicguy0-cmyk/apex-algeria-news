import { useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthError = {
  message: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) return false;

    return data?.role === "admin";
  };

  const loadUsername = async (userId: string) => {
    const { data } = await supabase
      .from("admin_accounts")
      .select("username")
      .eq("user_id", userId)
      .maybeSingle();

    setUsername(data?.username ?? null);
    return data?.username ?? null;
  };

  const refreshAdminExists = useCallback(async () => {
    const { data, error } = await supabase.rpc("admin_exists");
    const exists = error ? false : Boolean(data);
    setAdminExists(exists);
    return exists;
  }, []);

  useEffect(() => {
    refreshAdminExists();
  }, [refreshAdminExists]);

  useEffect(() => {
    const applySession = async (session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const admin = await checkAdminRole(session.user.id);
        setIsAdmin(admin);

        if (admin) {
          await loadUsername(session.user.id);
        } else {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setUsername(null);
        }
      } else {
        setIsAdmin(false);
        setUsername(null);
      }

      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => applySession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer Supabase calls out of the callback to avoid deadlocks.
      setTimeout(() => applySession(session), 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  /** Sign in with an application username (mapped to a Supabase Auth account). */
  const signIn = async (usernameInput: string, password: string) => {
    const cleaned = usernameInput.trim();

    if (!cleaned) {
      return { error: { message: "Username is required." } satisfies AuthError };
    }

    const { data: authEmail, error: resolveError } = await supabase.rpc(
      "resolve_admin_login",
      { _username: cleaned },
    );

    if (resolveError || !authEmail) {
      return {
        error: { message: "Invalid username or password." } satisfies AuthError,
      };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    });

    if (error) {
      return {
        error: { message: "Invalid username or password." } satisfies AuthError,
      };
    }

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
    await loadUsername(user.id);

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();

    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setUsername(null);
  };

  /** Change the admin-facing username. Does not touch the Auth email or session. */
  const updateUsername = async (newUsername: string) => {
    const cleaned = newUsername.trim();

    if (cleaned.length < 3 || cleaned.length > 32) {
      return {
        error: {
          message: "Username must be between 3 and 32 characters.",
        } satisfies AuthError,
      };
    }

    if (!/^[A-Za-z0-9._-]+$/.test(cleaned)) {
      return {
        error: {
          message:
            "Username may only contain letters, numbers, dot, dash and underscore.",
        } satisfies AuthError,
      };
    }

    if (!user) {
      return { error: { message: "Not authenticated." } satisfies AuthError };
    }

    const { error } = await supabase
      .from("admin_accounts")
      .update({ username: cleaned })
      .eq("user_id", user.id);

    if (error) {
      const taken = error.code === "23505";
      return {
        error: {
          message: taken ? "This username is already taken." : error.message,
        } satisfies AuthError,
      };
    }

    setUsername(cleaned);
    return { error: null };
  };

  /** Change the password through Supabase Auth after verifying the current one. */
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.email) {
      return { error: { message: "Not authenticated." } satisfies AuthError };
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      return {
        error: { message: "Current password is incorrect." } satisfies AuthError,
      };
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) return { error: { message: error.message } satisfies AuthError };

    return { error: null };
  };

  return {
    user,
    session,
    isAdmin,
    username,
    adminExists,
    refreshAdminExists,
    isPublisher: isAdmin,
    isReviewer: isAdmin,
    isJournalist: isAdmin,
    role: isAdmin ? "admin" : null,
    loading,
    signIn,
    signOut,
    updateUsername,
    updatePassword,
  };
}
