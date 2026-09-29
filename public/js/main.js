// ===============================================
// MAIN - INIZIALIZZAZIONE APPLICAZIONE
// ===============================================

/**
 * Punto di ingresso principale dell'app
 */
function initApp() {
  // Inizializza UI generica
  initUIBehaviors();
  initControlsListeners();
  initStatusSelectButtons();
  
  // Inizializza form
  initFormSubmit();
  
  // Inizializza ricerca
  initRawgSearch();
  
  // Inizializza export/import
  initMenuButtons();

  // Costruisce i chip filtri stato
  buildStatusFilter();
  
  // Carica configurazione e collezione
  loadConfig()
    .then(applyProviderUI)
    .then(loadCollection);
}

// Avvia l'app quando il DOM è pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
