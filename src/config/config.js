const { searchIgdb, searchRawg } = require("../services/providers");

function activeProvider() {
  if (process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET) return "igdb";
  if (process.env.RAWG_API_KEY) return "rawg";
  return null;
}

async function search(query) {
  const provider = activeProvider();
  if (!provider) throw new Error("Nessun provider configurato");
  if (provider === "igdb") return await searchIgdb(query);
  if (provider === "rawg") return await searchRawg(query);
}

module.exports = { activeProvider, search };
