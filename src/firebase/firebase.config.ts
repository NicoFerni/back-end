// Import the functions you need from the SDKs you need
import * as dotenv from 'dotenv'
import * as admin from 'firebase-admin';
dotenv.config();


const firebaseConfig = {
credential:admin.credential.cert({
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL
}),
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

// Initialize Firebase
admin.initializeApp(firebaseConfig);

export { admin };
