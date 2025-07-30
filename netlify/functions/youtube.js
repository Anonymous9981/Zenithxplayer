const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const query = event.queryStringParameters.q;
  const relatedToVideoId = event.queryStringParameters.relatedToVideoId;

  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'YouTube API key is not configured.' }) };
  }

  let apiUrl;
  if (query) {
    apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${query}&type=video&key=${apiKey}`;
  } else if (relatedToVideoId) {
    apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&relatedToVideoId=${relatedToVideoId}&type=video&key=${apiKey}`;
  } else {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing search query or video ID' }) };
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch data from YouTube API' }) };
  }
};

