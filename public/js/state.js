// ===============================================
// STATO GLOBALE DELL'APPLICAZIONE
// ===============================================

// Collezione di giochi (localStorage)
var collection = [];

// Filtri e ordinamento
var filterStatus = "all";
var sortMode = "name";
var searchTerm = "";
var editingId = null;

// Stato form
var selectedStatus = "completed";

// Provider configurato (IGDB o RAWG)
var provider = null;
