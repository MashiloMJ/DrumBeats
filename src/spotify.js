const clientId = "ebd727aa2ca349228e3f69d5c851ea3c";
const redirectUri = " http://localhost:5173/";

let accessToken = null;

// Generate random string
function generateRandomString(length) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Create code challenge
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// Get access token (PKCE flow)
async function getAccessToken() {
  if (accessToken) return accessToken;

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  // STEP 1: Redirect user to Spotify
  if (!code) {
    const codeVerifier = generateRandomString(128);
    localStorage.setItem("code_verifier", codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const scope = "playlist-modify-public";

    const authUrl =
      `https://accounts.spotify.com/authorize` +
      `?client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}`;

    window.location = authUrl;
    return;
  }

  // STEP 2: Exchange code for token
  const codeVerifier = localStorage.getItem("code_verifier");

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    }
  );

  const data = await response.json();
  accessToken = data.access_token;

  // Clean URL
  window.history.pushState({}, document.title, "/");

  return accessToken;
}

// 🎵 MAIN SPOTIFY OBJECT
export const Spotify = {
  async search(term) {
    const token = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await response.json();

    if (!json.tracks) return [];

    return json.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return;

    const token = await getAccessToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // 1. Get user ID
    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers,
    });
    const user = await userRes.json();

    // 2. Create playlist
    const playlistRes = await fetch(
      `https://api.spotify.com/v1/users/${user.id}/playlists`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: name,
          description: "Created with DrumBeats",
          public: true,
        }),
      }
    );

    const playlist = await playlistRes.json();

    // 3. Add tracks
    await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          uris: trackUris,
        }),
      }
    );

    console.log("Playlist saved!");
  },
};

