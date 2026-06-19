import { initializeApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyAKX7VcsNdevIBMpv0baWHnH4r17l19bdM",
  authDomain: "apex-c5262.firebaseapp.com",
  projectId: "apex-c5262",
  storageBucket: "apex-c5262.firebasestorage.app",
  messagingSenderId: "609645507794",
  appId: "1:609645507794:web:28e89e924dd7445211e90b",
};

export const firebaseApp = initializeApp(firebaseConfig);

// Messaging only works in secure contexts that support service workers.
// Returns null in unsupported environments (iframes, http, Safari versions, etc).
let _messaging: Messaging | null = null;
export async function getMessagingSafe(): Promise<Messaging | null> {
  if (_messaging) return _messaging;
  try {
    if (!(await isSupported())) return null;
    _messaging = getMessaging(firebaseApp);
    return _messaging;
  } catch {
    return null;
  }
}
