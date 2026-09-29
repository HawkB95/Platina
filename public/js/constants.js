// ===============================================
// COSTANTI GLOBALI
// ===============================================

// Status in ordine crescente di "valore"
var STATUSES = ["abandoned", "backlog", "played", "completed", "platinum"];

// Ordine di visualizzazione (decrescente)
var STATUS_DISPLAY = ["platinum", "completed", "played", "backlog", "abandoned"];

// Nomi in italiano
var STATUS_IT = {
  platinum: "Platinato",
  completed: "Completato",
  played: "Giocato",
  backlog: "Backlog",
  abandoned: "Abbandonato"
};

// Ordine numerico per sorting
var STATUS_ORDER = {
  abandoned: 0,
  backlog: 1,
  played: 2,
  completed: 3,
  platinum: 4
};

// Abbreviazioni per i chip di filtro
var STATUS_CHIP = {
  platinum:  "P",
  completed: "C",
  played:    "G",
  backlog:   "BL",
  abandoned: "A"
};

