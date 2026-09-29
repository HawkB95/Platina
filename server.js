const express = require("express");
const path = require("path");

const { activeProvider } = require("./src/config/config");
const searchRoutes = require("./src/routes/search");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "public")));

app.use(searchRoutes);

app.use((err, req, res, next) => {
  console.error("Errore:", err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  const provider = activeProvider();
  console.log("PLATINA in esecuzione su http://localhost:" + PORT);
  console.log("Ricerca giochi: " + (provider ? provider.toUpperCase() : "non configurata"));
});
