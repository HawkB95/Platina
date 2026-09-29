// ===============================================
// COMUNICAZIONE API — solo ricerca e config
// I giochi sono salvati in localStorage
// ===============================================

var STORAGE_KEY = "platina_games";

/**
 * Wrapper fetch con gestione errori JSON (usato solo per /api/search e /api/config)
 */
function api(path, opts) {
  return fetch(path, Object.assign({
    headers: { "Content-Type": "application/json" }
  }, opts)).then(function (r) {
    if (!r.ok) {
      return r.json().then(function (e) {
        throw new Error(e.error || ("HTTP " + r.status));
      });
    }
    return r.json();
  });
}

/**
 * Carica configurazione del provider da /api/config
 */
function loadConfig() {
  return api("/api/config").then(function (c) {
    provider = c.provider;
  }).catch(function () {
    provider = null;
  });
}

/**
 * Carica la collezione dal localStorage
 */
function loadCollection() {
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    collection = stored ? JSON.parse(stored).map(function (g) {
      g.status = statusOf(g);
      return g;
    }) : [];
  } catch (e) {
    collection = [];
  }
  render();
  return Promise.resolve();
}

/**
 * Salva la collezione nel localStorage
 */
function saveCollection() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}
