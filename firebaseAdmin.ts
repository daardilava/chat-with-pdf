// firebaseAdmin.ts

import { getApps, getApp, App, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceKey = require('@/service_key.json');

let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceKey),
  });
} else {
  app = getApp(); // ✅ ahora sí es el de firebase-admin
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
