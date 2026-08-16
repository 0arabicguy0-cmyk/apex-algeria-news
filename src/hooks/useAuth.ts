import { useCallback, useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthError = {
  message: string;
};

const debug = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.info("[auth]", ...args);
};

/** Returns true when the given user holds the `admin` role. */
async function checkAdminRole(userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    debug("role check failed", error.code, error.message);
    return false;
  }

  return data?.role === "admin";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  /** Guards the listener from racing with an in-flight signIn/signOut. */
  const authInFlight = useRef(false);
  const mounted = useRef(true);

  const loadUsername = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("admin_accounts")
      .select("username")
      .eq("user_id", userId)
      .maybeSingle();

    const name = data?.username ?? null;
    if (mounted.current) setUsername(name);
    return name;
  }, []);

  const refreshAdminExists = useCallback(async () => {
    const { data, error } = await supabase.rpc("admin_exists");
    const exists = error ? false : Boolean(data);
    if (mounted.current) setAdminExists(exists);
    return exists;
  }, []);

  useEffect(() => {
    refreshAdminExists();
  }, [refreshAdminExists]);

  useEffect(() => {
    mounted.current = true;

    const applySession = async (nextSession: Session | null) => {
      if (!mounted.current) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        const admin = await checkAdminRole(nextSession.user.id);
        if (!mounted.current) return;

        setIsAdmin(admin);
        if (admin) {
          await loadUsername(nextSession.user.id);
        } else {
          // Non-admin session: keep it, just deny admin access.
          setUsername(null);
        }
      } else {
        setIsAdmin(false);
        setUsername(null);
      }

      if (mounted.current) setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      if (authInFlight.current) return;
      applySession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      debug("auth event", event, "session:", Boolean(nextSession));
      // Defer Supabase calls out of the callback to avoid deadlocks,
      // and skip while an explicit signIn/signOut is still running.
      setTimeout(() => {
        if (authInFlight.current) return;
        applySession(nextSession);
      }, 0);
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [loadUsername]);

  /** Sign in with an application username (mapped to a Supabase Auth account). */
  const signIn = async (usernameInput: string, password: string) => {
    const cleaned = usernameInput.trim();

    if (!cleaned) {
      return { error: { message: "Username is required." } satisfies AuthError };
    }

    authInFlight.current = true;

    try {
      const { data: authEmail, error: resolveError } = await supabase.rpc(
        "resolve_admin_login",
        { _username: cleaned },
      );

      debug("resolve_admin_login", cleaned, "ok:", Boolean(authEmail), resolveError?.message);

      if (resolveError || !authEmail) {
        return {
          error: { message: "Invalid username or password." } satisfies AuthError,
        };
      }

      // Exactly ONE authentication attempt per submission.
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

      if (error || !data.session || !data.user) {
        debug("signIn failed", error?.status, error?.message);
        return {
          error: { message: "Invalid username or password." } satisfies AuthError,
        };
      }

      const admin = await checkAdminRole(data.user.id);
      debug("signed in", data.user.id, "admin:", admin);

      if (!admin) {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        setUsername(null);

        return {
          error: {
            message: "You are not authorized to access the admin panel.",
          } satisfies AuthError,
        };
      }

      setSession(data.session);
      setUser(data.user);
      setIsAdmin(true);
      setLoading(false);
      await loadUsername(data.user.id);

      return { error: null };
    } finally {
      authInFlight.current = false;
    }
  };

  const signOut = async () => {
    authInFlight.current = true;
    try {
      await supabase.auth.signOut();
    } finally {
      authInFlight.current = false;
    }

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

  /**
   * Change the password through the existing `update-admin-password` Edge
   * Function. Never re-authenticates on the client, so the session survives.
   */
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      return { error: { message: "Not authenticated." } satisfies AuthError };
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "update-admin-password",
        { body: { currentPassword, newPassword } },
      );

      if (error) {
        let message = error.message || "Unable to update the password.";

        // Surface the safe error message returned by the function body.
        const ctx = (error as { context?: Response }).context;
        if (ctx && typeof ctx.json === "function") {
          try {
            const body = await ctx.json();
            if (body?.error) message = String(body.error);
          } catch {
            /* non-JSON response */
          }
        }

        debug("password update failed:", message);
        return { error: { message } satisfies AuthError };
      }

      if (data && typeof data === "object" && "error" in data && data.error) {
        return { error: { message: String(data.error) } satisfies AuthError };
      }

      return { error: null };
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Network error. Please try again.";
      debug("password update exception:", message);
      return { error: { message } satisfies AuthError };
    }
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
