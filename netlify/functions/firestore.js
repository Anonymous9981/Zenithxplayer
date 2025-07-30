const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin with service account
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

exports.handler = async (event, context) => {
  // Ensure the user is authenticated
  if (!context.clientContext || !context.clientContext.user) {
    return { statusCode: 401, body: 'Unauthorized' };
  }
  
  const userId = context.clientContext.user.sub;
  const userDocRef = db.collection('users').doc(userId);
  const { action, payload } = event.httpMethod === 'POST' ? JSON.parse(event.body) : { action: 'getAll' };

  try {
    let data;
    switch (action) {
      case 'getAll':
        const doc = await userDocRef.get();
        data = doc.exists ? doc.data() : { playlist: [], likedSongs: [] };
        return { statusCode: 200, body: JSON.stringify(data) };

      case 'savePlaylist':
        await userDocRef.set({ playlist: payload }, { merge: true });
        return { statusCode: 200, body: 'Playlist saved' };

      case 'saveLikedSongs':
        await userDocRef.set({ likedSongs: payload }, { merge: true });
        return { statusCode: 200, body: 'Liked songs saved' };

      default:
        return { statusCode: 400, body: 'Invalid action' };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

