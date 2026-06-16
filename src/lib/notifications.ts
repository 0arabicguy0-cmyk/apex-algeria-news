import { getToken } from "firebase/messaging";
import { messaging } from "@/firebase";

export async function registerPushNotifications() {

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    return null;
  }

  const token = await getToken(messaging, {
    vapidKey: "VAPID_KEY"
  });

  return token;
}