import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export type ExpoPushTokenInfo = {
  expoPushToken: string;
  platform: string;
  updatedAt: ReturnType<typeof serverTimestamp>;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotificationsAsync = async (): Promise<
  string | null
> => {
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permissions not granted.");
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  const tokenResponse = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );

  return tokenResponse.data ?? null;
};

export const savePushTokenForCurrentUser = async (
  uid: string,
  token: string,
  platform: string = Platform.OS,
): Promise<void> => {
  const userRef = doc(db, "users", uid);

  const tokenInfo: ExpoPushTokenInfo = {
    expoPushToken: token,
    platform,
    updatedAt: serverTimestamp(),
  };

  await setDoc(
    userRef,
    {
      expoPushToken: tokenInfo.expoPushToken,
      platform: tokenInfo.platform,
      updatedAt: tokenInfo.updatedAt,
    },
    { merge: true },
  );
};

export const addNotificationsListeners = (
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (
    response: Notifications.NotificationResponse,
  ) => void,
) => {
  const receivedListener =
    onNotificationReceived &&
    Notifications.addNotificationReceivedListener(onNotificationReceived);

  const responseListener =
    onNotificationResponse &&
    Notifications.addNotificationResponseReceivedListener(
      onNotificationResponse,
    );

  return () => {
    receivedListener?.remove();
    responseListener?.remove();
  };
};

