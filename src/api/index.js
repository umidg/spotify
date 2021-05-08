export const _getToken = async () => {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        btoa(
          process.env.REACT_APP_CLIENT_ID +
            ":" +
            process.env.REACT_APP_CLIENT_SECRET
        ),
    },
    body: "grant_type=client_credentials",
  });
  const data = await result.json();
  return data.access_token;
};

export const _getGenres = async (token) => {
  const result = await fetch(
    `${process.env.REACT_APP_SPOTIFY_URL}?locale=sv_US`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    }
  );

  const data = await result.json();
  return data.categories.items;
};

export const _getPlaylistByGenre = async (genreId, token, limit) => {
  //   const limit = 10;

  const result = await fetch(
    `${process.env.REACT_APP_SPOTIFY_URL}/${genreId}/playlists?limit=${limit}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    }
  );
  const data = await result.json();
  // console.log(data, "data ");
  return data.playlists;
};

// export const _getTracks = async (tracksEndPoint) => {
//   const limit = 10;

//   const result = await fetch(`${tracksEndPoint}/?limit=${limit}`, {
//     method: "GET",
//     headers: { Authorization: "Bearer " + token },
//   });

//   const data = await result.json();
//   const t = data.items;
//   settracks([...t]);
//   return data.items;
// };
