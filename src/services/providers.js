// IGDB (Twitch OAuth2)
let igdbToken = null;
let igdbTokenExpiry = 0;

async function getIgdbToken() {
  if (igdbToken && Date.now() < igdbTokenExpiry - 60000) return igdbToken;

  const url =
    "https://id.twitch.tv/oauth2/token" +
    "?client_id=" + encodeURIComponent(process.env.TWITCH_CLIENT_ID) +
    "&client_secret=" + encodeURIComponent(process.env.TWITCH_CLIENT_SECRET) +
    "&grant_type=client_credentials";

  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error("Autenticazione IGDB/Twitch fallita (" + res.status + ")");

  const data = await res.json();
  igdbToken = data.access_token;
  igdbTokenExpiry = Date.now() + data.expires_in * 1000;
  return igdbToken;
}

function mapIgdbGame(g) {
  let year = null;
  let releaseDate = null;
  if (g.first_release_date) {
    const d = new Date(g.first_release_date * 1000);
    year = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    releaseDate = year + "-" + mm + "-" + dd;
  }

  let score = null;
  if (typeof g.aggregated_rating === "number") score = Math.round(g.aggregated_rating) / 10;
  else if (typeof g.rating === "number") score = Math.round(g.rating) / 10;

  let cover = null;
  if (g.cover && g.cover.image_id)
    cover = "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/" + g.cover.image_id + ".jpg";

  const platform = g.platforms && g.platforms.length ? g.platforms[0].name : "";
  const description = g.summary || null;
  const tags = g.genres && g.genres.length ? g.genres.map(x => x.name).join(", ") : null;

  let developer = null;
  if (g.involved_companies && g.involved_companies.length) {
    const devEntry = g.involved_companies.find(ic => ic.developer);
    const picked = devEntry || g.involved_companies[0];
    if (picked && picked.company) developer = picked.company.name;
  }

  return { name: g.name, year, releaseDate, score, cover, platform, description, tags, developer };
}

async function searchIgdb(query) {
  const token = await getIgdbToken();
  const safeQ = query.replace(/"/g, "").trim();

  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: "Bearer " + token,
    "Content-Type": "text/plain",
  };

  const commonFields =
    " fields name, first_release_date, rating, aggregated_rating," +
    " cover.image_id, platforms.name, summary, genres.name," +
    " involved_companies.company.name, involved_companies.developer;";

  const bodyFuzzy = 'search "' + safeQ + '";' + commonFields + " limit 12;";
  const bodyExact = commonFields + ' where name ~ *"' + safeQ + '"*; sort rating desc; limit 8;';

  const [resFuzzy, resExact] = await Promise.all([
    fetch("https://api.igdb.com/v4/games", { method: "POST", headers, body: bodyFuzzy }),
    fetch("https://api.igdb.com/v4/games", { method: "POST", headers, body: bodyExact }),
  ]);

  const rowsFuzzy = resFuzzy.ok ? await resFuzzy.json() : [];
  const rowsExact = resExact.ok ? await resExact.json() : [];

  const seen = new Set();
  const merged = [];
  for (const g of [...rowsFuzzy, ...rowsExact]) {
    if (g.id != null && !seen.has(g.id)) { seen.add(g.id); merged.push(g); }
  }

  return merged.slice(0, 14).map(mapIgdbGame);
}

// RAWG
async function searchRawg(query) {
  const url =
    "https://api.rawg.io/api/games?key=" + encodeURIComponent(process.env.RAWG_API_KEY) +
    "&search=" + encodeURIComponent(query) + "&page_size=8";

  const res = await fetch(url);
  if (!res.ok) throw new Error("Ricerca RAWG fallita (" + res.status + ")");

  const data = await res.json();
  return ((data && data.results) || []).map((g) => {
    const year = g.released ? parseInt(g.released.slice(0, 4), 10) : null;

    let score = null;
    if (typeof g.metacritic === "number" && g.metacritic > 0) score = Math.round(g.metacritic) / 10;
    else if (typeof g.rating === "number" && g.rating > 0) score = Math.round(g.rating * 2 * 10) / 10;

    const platform = g.parent_platforms && g.parent_platforms.length
      ? g.parent_platforms[0].platform.name : "";
    const tags = g.genres && g.genres.length ? g.genres.map(x => x.name).join(", ") : null;
    const developer = g.developers && g.developers.length ? g.developers[0].name : null;

    return { name: g.name, year, releaseDate: g.released || null, score, cover: g.background_image || null, platform, tags, developer };
  });
}

module.exports = { searchIgdb, searchRawg };
