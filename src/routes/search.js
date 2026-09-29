const express = require("express");
const { activeProvider, search } = require("../config/config");

const router = express.Router();

router.get("/api/config", (req, res) => {
  res.json({ provider: activeProvider() });
});

router.get("/api/search", async (req, res) => {
  const q = (req.query.q || "").toString().trim();
  const provider = activeProvider();

  if (!provider) return res.json({ provider: null, results: [] });
  if (!q) return res.json({ provider, results: [] });

  try {
    const results = await search(q);
    res.json({ provider, results });
  } catch (err) {
    console.error("Errore ricerca:", err.message);
    res.status(502).json({ provider, error: err.message, results: [] });
  }
});

module.exports = router;
