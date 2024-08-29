import * as dotenv from 'dotenv'
import * as admin from 'firebase-admin';
dotenv.config();


const firebaseConfig = {
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_ID,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),

  }),
  databaseURL: "https://profile-picture-ee5b2-default-rtdb.firebaseio.com",
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  storageBucket: 'gs://profile-picture-ee5b2.appspot.com',
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const app = admin.initializeApp(firebaseConfig);

export { app };