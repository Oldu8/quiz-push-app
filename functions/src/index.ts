import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

setGlobalOptions({ maxInstances: 10 });

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

type SendToUserRequestBody = {
  uid?: string;
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
};

export const sendToUser = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const expectedSecret = process.env.FUNCTIONS_SEND_TO_USER_SECRET;
  const providedSecret = req.get("x-admin-secret");

  if (expectedSecret && providedSecret !== expectedSecret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { uid, title, body, data }: SendToUserRequestBody = req.body ?? {};

    if (!uid || !title || !body) {
      res
        .status(400)
        .json({ error: "Missing required fields: uid, title, body" });
      return;
    }

    const userRef = db.collection("users").doc(uid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userData = snapshot.data() as {
      expoPushToken?: string | null;
      platform?: string | null;
    };

    const expoPushToken = userData.expoPushToken;

    if (!expoPushToken) {
      res.status(400).json({ error: "User has no expoPushToken" });
      return;
    }

    if (!expoPushToken.startsWith("ExponentPushToken[")) {
      res.status(400).json({
        error: "Invalid Expo push token format",
      });
      return;
    }

    const expoResponse = await fetch(
      "https://exp.host/--/api/v2/push/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: expoPushToken,
          sound: "default",
          title,
          body,
          data: data ?? {},
        }),
      },
    );

    const expoJson = await expoResponse.json();

    if (!expoResponse.ok) {
      res.status(502).json({
        success: false,
        error: "Expo push service error",
        expo: expoJson,
      });
      return;
    }

    res.status(200).json({
      success: true,
      expo: expoJson,
    });
  } catch (error) {
    console.error("sendToUser error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

