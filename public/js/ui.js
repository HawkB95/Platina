// ===============================================
// GESTIONE UI - OVERLAY, MODAL, EVENT LISTENER
// ===============================================

var _confirmCallback = null;

/**
 * Apre un overlay/modal
 */
function openOverlay(id) {
  document.getElementById(id).setAttribute("data-open", "true");
}

/**
 * Chiude un overlay/modal e rilascia il focus
 */
function closeOverlay(id) {
  var el = document.getElementById(id);
  el.setAttribute("data-open", "false");
  if (el.contains(document.activeElement)) {
    document.activeElement.blur();
  }
}

/**
 * Mostra il dialog di conferma eliminazione (custom, senza native confirm)
 */
function showConfirm(title, onOk) {
  document.getElementById("confirm-game-name").textContent = title;
  _confirmCallback = onOk;
  openOverlay("confirm-overlay");
  setTimeout(function () { document.getElementById("confirm-cancel").focus(); }, 60);
}

/**
 * Inizializza i comportamenti globali degli overlay
 */
function initUIBehaviors() {
  // Chiudi quando clicchi il pulsante [data-close]
  Array.prototype.forEach.call(document.querySelectorAll("[data-close]"), function (b) {
    b.addEventListener("click", function () {
      var ov = b.closest(".overlay");
      if (ov) ov.setAttribute("data-open", "false");
    });
  });

  // Chiudi quando clicchi fuori dal modal
  Array.prototype.forEach.call(document.querySelectorAll(".overlay"), function (ov) {
    ov.addEventListener("click", function (e) {
      if (e.target === ov) ov.setAttribute("data-open", "false");
    });
  });

  // Chiudi con Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      Array.prototype.forEach.call(document.querySelectorAll(".overlay"), function (o) {
        o.setAttribute("data-open", "false");
      });
    }
  });

  // Confirm dialog buttons
  document.getElementById("confirm-ok").addEventListener("click", function () {
    closeOverlay("confirm-overlay");
    var cb = _confirmCallback;
    _confirmCallback = null;
    if (cb) cb();
  });

  document.getElementById("confirm-cancel").addEventListener("click", function () {
    closeOverlay("confirm-overlay");
    _confirmCallback = null;
  });
}

/**
 * Gestisce il cambio di stato nel form
 */
function setSelectedStatus(s) {
  selectedStatus = s;
  var statusSelect = document.getElementById("status-select");
  Array.prototype.forEach.call(statusSelect.querySelectorAll("button"), function (b) {
    b.setAttribute("aria-pressed", b.getAttribute("data-s") === s ? "true" : "false");
  });
}

/**
 * Inizializza i bottoni del selettore stato
 */
function initStatusSelectButtons() {
  var statusSelect = document.getElementById("status-select");
  Array.prototype.forEach.call(statusSelect.querySelectorAll("button"), function (b) {
    b.addEventListener("click", function () {
      setSelectedStatus(b.getAttribute("data-s"));
    });
  });
}

/**
 * Inizializza event listener per search, sort
 */
function initControlsListeners() {
  document.getElementById("search").addEventListener("input", function (e) {
    searchTerm = e.target.value.toLowerCase().trim();
    render();
  });
  
  // Custom sort dropdown
  var sortBtn      = document.getElementById("sort-btn");
  var sortDropdown = document.getElementById("sort-dropdown");
  var sortLabel    = document.getElementById("sort-label");

  sortBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    var opening = !sortDropdown.classList.contains("open");
    sortDropdown.classList.toggle("open", opening);
    sortBtn.classList.toggle("active", opening);
    sortBtn.setAttribute("aria-expanded", String(opening));
  });

  sortDropdown.addEventListener("click", function (e) { e.stopPropagation(); });

  document.addEventListener("click", function () {
    sortDropdown.classList.remove("open");
    sortBtn.classList.remove("active");
    sortBtn.setAttribute("aria-expanded", "false");
  });

  Array.prototype.forEach.call(
    sortDropdown.querySelectorAll(".sort-option"),
    function (opt) {
      opt.addEventListener("click", function () {
        sortMode = opt.getAttribute("data-value");
        sortLabel.textContent = opt.textContent.trim();
        Array.prototype.forEach.call(
          sortDropdown.querySelectorAll(".sort-option"),
          function (o) { o.classList.toggle("active", o === opt); }
        );
        sortDropdown.classList.remove("open");
        sortBtn.classList.remove("active");
        sortBtn.setAttribute("aria-expanded", "false");
        render();
      });
    }
  );
}
