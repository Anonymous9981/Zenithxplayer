const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

let db;

function initializeDb() {
    if (!db) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        initializeApp({
            credential: cert(serviceAccount)
        });
        db = getFirestore();
    }
}

exports.handler = async (event, context) => {
  if (!context.clientContext || !context.clientContext.user) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }
  
  initializeDb();
  const userId = context.clientContext.user.sub;
  const userDocRef = db.collection('users').doc(userId);

  try {
    if (event.httpMethod === 'GET') {
        const doc = await userDocRef.get();
        const data = doc.exists ? doc.data() : { queue: [], likedSongs: [] };
        return { statusCode: 200, body: JSON.stringify(data) };
    }

    if (event.httpMethod === 'POST') {
        const { action, payload } = JSON.parse(event.body);
        let updateData = {};
        if (action === 'saveQueue') updateData.queue = payload;
        else if (action === 'saveLikedSongs') updateData.likedSongs = payload;
        else return { statusCode: 400, body: 'Invalid action' };

        await userDocRef.set(updateData, { merge: true });
        return { statusCode: 200, body: `Data saved for action: ${action}` };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

