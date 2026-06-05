import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

// Explicitly use the fields from firebase-applet-config.json with safe fallback options
const parsedConfig = {
  apiKey: firebaseConfig.apiKey || "AIzaSyCZUGw_uN_aXxrDGMWFkOxAg3PVVNe7Pc4",
  authDomain: firebaseConfig.authDomain || "gen-lang-client-0414020543.firebaseapp.com",
  projectId: firebaseConfig.projectId || "gen-lang-client-0414020543",
  appId: firebaseConfig.appId || "1:181471438912:web:7f6dc27d738d771bbe17a5",
  storageBucket: firebaseConfig.storageBucket || "gen-lang-client-0414020543.firebasestorage.app",
  messagingSenderId: firebaseConfig.messagingSenderId || "181471438912",
  measurementId: firebaseConfig.measurementId || ""
};

const app = initializeApp(parsedConfig);

const databaseId = firebaseConfig.firestoreDatabaseId || "ai-studio-80cdaf4c-5c57-4108-9c8a-9471450dbe3a";

export const db = getFirestore(app, databaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
export const storage = getStorage(app);

// Run connection validation check as requested by the firebase-integration skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration: Client is offline.");
    } else {
      console.warn("Firebase connection info:", error);
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
