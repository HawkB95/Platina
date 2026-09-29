// ===============================================
// RICERCA RAWG E UPLOAD COPERTINA
// ===============================================

var rawgInput = document.getElementById("rawg-search");
var rawgResults = document.getElementById("rawg-results");
var rawgSpin = document.getElementById("rawg-spin");
var rawgTimer = null;
var rawgController = null;

/**
 * Mostra un messaggio nei risultati RAWG
 */
function rawgMsg(html) {
  rawgResults.innerHTML = '<div class="rawg-msg">' + html + '</div>';
  rawgResults.classList.add("show");
}

/**
 * Aggiorna l'UI del form in base al provider configurato
 */
function applyProviderUI() {
  var label = document.getElementById("rawg-label");
  if (provider) {
    label.textContent = "Cerca nel database (" + provider.toUpperCase() + ")";
    rawgInput.disabled = false;
    rawgInput.placeholder = "es. Elden Ring...";
  } else {
    label.textContent = "Ricerca non configurata";
    rawgInput.disabled = true;
    rawgInput.placeholder = "Ricerca non disponibile";
  }
}

/**
 * Esegue la ricerca via /api/search
 */
function doSearch(q) {
  if (!provider) {
    rawgMsg('La ricerca automatica non è configurata. Inserisci il gioco manualmente.');
    return;
  }
  
  if (rawgController) rawgController.abort();
  rawgController = new AbortController();
  rawgSpin.style.display = "block";
  
  fetch("/api/search?q=" + encodeURIComponent(q), { signal: rawgController.signal })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      rawgSpin.style.display = "none";
      
      if (data.error) {
        rawgMsg("Ricerca non riuscita: " + escapeHtml(data.error) + ". Puoi inserire il gioco a mano.");
        return;
      }
      
      var list = data.results || [];
      if (!list.length) {
        rawgMsg("Nessun gioco trovato. Prova un altro titolo o inseriscilo a mano.");
        return;
      }
      
      rawgResults.innerHTML = list.map(function (g, i) {
        var thumb = g.cover ? 'style="background-image:' + cssUrl(g.cover) + '"' : '';
        var sub = [g.year, g.platform].filter(Boolean).join(" · ");
        return '<div class="rawg-item" data-i="' + i + '">' +
          '<div class="thumb" ' + thumb + '></div>' +
          '<div><div class="ri-title">' + escapeHtml(g.name) + '</div>' +
          '<div class="ri-sub">' + escapeHtml(sub) + '</div></div>' +
          '</div>';
      }).join("");
      
      rawgResults.classList.add("show");
      
      Array.prototype.forEach.call(rawgResults.querySelectorAll(".rawg-item"), function (it) {
        it.addEventListener("click", function () {
          fillFromResult(list[parseInt(it.getAttribute("data-i"), 10)]);
        });
      });
    })
    .catch(function (err) {
      rawgSpin.style.display = "none";
      if (err.name === "AbortError") return;
      rawgMsg("Ricerca non riuscita. Puoi inserire il gioco a mano qui sotto.");
    });
}

/**
 * Riempie il form con i dati da un risultato RAWG
 */
function fillFromResult(g) {
  if (!g) return;
  document.getElementById("f-title").value = g.name || "";
  document.getElementById("f-year").value = g.releaseDate || (g.year != null ? g.year : "");
  document.getElementById("f-cover").value = g.cover || "";
  document.getElementById("f-developer").value = g.developer || "";
  document.getElementById("f-score").value = g.score != null ? g.score : "";
  document.getElementById("f-description").value = g.description || "";
  document.getElementById("f-tags").value = g.tags || "";
  rawgResults.classList.remove("show");
  rawgInput.value = g.name || "";
  document.getElementById("f-platform").focus();
}

/**
 * Inizializza la ricerca RAWG con debounce
 */
function initRawgSearch() {
  rawgInput.addEventListener("input", function () {
    var q = rawgInput.value.trim();
    clearTimeout(rawgTimer);
    
    if (!q) {
      rawgResults.classList.remove("show");
      rawgResults.innerHTML = "";
      return;
    }
    
    rawgTimer = setTimeout(function () {
      doSearch(q);
    }, 350);
  });
  
  rawgInput.addEventListener("focus", function () {
    if (rawgResults.innerHTML) rawgResults.classList.add("show");
  });
}

