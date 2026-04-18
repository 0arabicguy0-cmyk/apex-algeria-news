import { useEffect, useState } from "react";
import { mockAuth } from "@/lib/mockStore";

export function useAuth() {
  const [user, setUser] = useState(mockAuth.getUser());

  useEffect(() => {
    const sync = () => setUser(mockAuth.getUser());
    window.addEventListener("mockauth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mockauth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = mockAuth.signIn(email, password);
    return { error: error ? { message: error } : null };
  };
  const signOut = async () => mockAuth.signOut();

  return { user, isAdmin: !!user, loading: false, signIn, signOut };
}
