// This function needs node-fetch to make API calls in the Node.js environment.
// Netlify will automatically install this dependency for you during deployment.
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  // Get the secure API key from Netlify's environment variables.
  const apiKey = process.env.YOUTUBE_API_KEY;

  // Get the search query or related video ID from the URL parameters sent by the frontend.
  const query = event.queryStringParameters.q;
  const relatedToVideoId = event.queryStringParameters.relatedToVideoId;

  let apiUrl;

  // Check if an API key is available. If not, return an error.
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'YouTube API key is not configured.' }),
    };
  }

  // Construct the correct YouTube API URL based on the parameters received.
  if (query) {
    apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&type=video&key=${apiKey}`;
  } else if (relatedToVideoId) {
    apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&relatedToVideoId=${relatedToVideoId}&type=video&key=${apiKey}`;
  } else {
    // If no valid parameters are provided, return an error.
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing search query or video ID' }),
    };
  }

  try {
    // Call the YouTube API from our secure function.
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Return the data from YouTube back to our frontend app.
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Handle any network or API errors.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from YouTube API' }),
    };
  }
};
