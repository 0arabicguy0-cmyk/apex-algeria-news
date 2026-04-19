import { useEffect, useState } from "react";
import { mockAuth, type UserRole, type MockUser } from "@/lib/mockStore";

export type { UserRole, MockUser };

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(mockAuth.getUser());

  useEffect(() => {
    const sync = () => setUser(mockAuth.getUser());
    window.addEventListener("mockauth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mockauth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signIn = async (email: string, password: string, role: UserRole = "admin") => {
    const { error } = mockAuth.signIn(email, password, role);
    return { error: error ? { message: error } : null };
  };
  const signOut = async () => mockAuth.signOut();

  const role = user?.role ?? null;
  return {
    user,
    role,
    isAdmin: !!user,                 // any logged-in role can access /admin
    isPublisher: role === "admin",
    isReviewer: role === "editor" || role === "admin",
    isJournalist: role === "journalist" || role === "editor" || role === "admin",
    loading: false,
    signIn,
    signOut,
  };
}
