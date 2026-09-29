var grid = document.getElementById("grid");

function renderStats() {
  var counts = {};
  STATUSES.forEach(function (s) { counts[s] = 0; });
  collection.forEach(function (c) { counts[statusOf(c)]++; });

  var platBadgeNum = document.getElementById("plat-badge-num");
  if (platBadgeNum) platBadgeNum.textContent = counts.platinum;

  var compBadgeNum = document.getElementById("comp-badge-num");
  if (compBadgeNum) compBadgeNum.textContent = counts.completed;

  var totalCountEl = document.getElementById("total-count");
  if (totalCountEl) totalCountEl.textContent = collection.length + " giochi";
}

function visibleCards() {
  var arr = collection.filter(function (c) {
    if (filterStatus !== "all" && statusOf(c) !== filterStatus) return false;
    if (searchTerm && c.title.toLowerCase().indexOf(searchTerm) === -1) return false;
    return true;
  });

  arr.sort(function (a, b) {
    switch (sortMode) {
      case "status-desc": return (STATUS_ORDER[statusOf(b)] - STATUS_ORDER[statusOf(a)]) || (b.dateAdded - a.dateAdded);
      case "status-asc":  return (STATUS_ORDER[statusOf(a)] - STATUS_ORDER[statusOf(b)]) || (b.dateAdded - a.dateAdded);
      case "name":        return a.title.localeCompare(b.title);
      default:            return 0;
    }
  });

  return arr;
}

function cardArtHTML(c) {
  if (c.cover) {
    return '<div class="card-art-full" style="background-image:' + cssUrl(c.cover) + '"></div>';
  }
  return '<div class="card-art-full" style="background:' + gradientFor(c.title) + '"></div>' +
    '<div class="art-fallback">' + initials(c.title) + '</div>';
}

function cardInner(c, s) {
  var platform  = c.platform  || '';
  var developer = c.developer || '';

  return '<div class="card-frame">' +
    cardArtHTML(c) +
    '<div class="card-inner">' +
      '<div class="card-header">' +
        '<div class="game-title">' + escapeHtml(c.title) + '</div>' +
      '</div>' +
      '<div class="card-spacer"></div>' +
      '<div class="card-text-area">' +
        '<div class="type-line">' +
          '<span class="type-text">' + STATUS_IT[s] + '</span>' +
        '</div>' +
        '<div class="card-info-list">' +
          (function() { var rd = formatReleaseDate(c); return rd ? '<div class="info-row"><span class="info-label">Data di rilascio</span><span class="info-value">' + escapeHtml(rd) + '</span></div>' : ''; })() +
          (developer ? '<div class="info-row"><span class="info-label">Sviluppatori</span><span class="info-value">' + escapeHtml(developer) + '</span></div>' : '') +
          (platform  ? '<div class="info-row"><span class="info-label">Piattaforma</span><span class="info-value">'  + escapeHtml(platform)  + '</span></div>' : '') +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="holo"></div>' +
    '<div class="card-glare"></div>' +
    '<div class="art-shine"></div>' +
  '</div>';
}

function cardBack(c, s) {
  var tags = typeof c.tags === 'string'
    ? c.tags.split(',').map(function(t) { return t.trim(); }).filter(Boolean)
    : (Array.isArray(c.tags) ? c.tags : []);
  var desc = c.description || 'Nessuna descrizione disponibile.';

  return '<div class="card-back-face" data-id="' + c.id + '">' +
    '<div class="card-back-header">' + escapeHtml(c.title) + '</div>' +
    '<div class="card-back-scroll">' +
      '<p class="card-back-desc">' + escapeHtml(desc) + '</p>' +
      (tags.length ? '<div class="card-back-tags">' +
        tags.map(function(t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('') +
      '</div>' : '') +
    '</div>' +
    '<div class="card-back-actions">' +
      '<button class="card-back-edit" data-id="' + c.id + '">Modifica</button>' +
      '<button class="card-back-del"  data-id="' + c.id + '">Elimina</button>' +
    '</div>' +
  '</div>';
}

function render() {
  renderStats();
  var cards = visibleCards();

  if (collection.length === 0) {
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1">' +
      '<div class="big">La tua libreria è vuota</div>' +
      '<p>Aggiungi il primo gioco e scegli il suo stato. Il bordo della carta cambia in base a quanto lontano sei arrivato: platinato, completato, giocato, in backlog o abbandonato.</p>' +
      '</div>';
    return;
  }

  if (cards.length === 0) {
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1">' +
      '<div class="big">Nessun risultato</div>' +
      '<p>Prova a cambiare ricerca o filtro.</p>' +
      '</div>';
    return;
  }

  grid.innerHTML = cards.map(function (c, idx) {
    var s = statusOf(c);
    return '<div class="card-wrap" data-s="' + s + '" data-id="' + c.id + '" style="animation-delay:' + Math.min(idx * 30, 300) + 'ms">' +
      '<div class="card-glow"></div>' +
      '<div class="card" data-s="' + s + '">' + cardInner(c, s) + '</div>' +
    '</div>';
  }).join("");

  Array.prototype.forEach.call(grid.querySelectorAll(".card-wrap"), function (wrap) {
    var card = wrap.querySelector(".card");
    var s    = wrap.getAttribute("data-s");
    wrap.addEventListener("click", function () { openDetail(wrap.getAttribute("data-id")); });
    if (card && s !== "played" && s !== "backlog" && s !== "abandoned") attachTilt(card);
  });
}

function buildStatusFilter() {
  var statusFilterEl = document.getElementById("status-filter");
  var html = '<button class="chip" data-s="all" data-active="true">TUTTI</button>';
  STATUS_DISPLAY.forEach(function (s) {
    html += '<button class="chip" data-s="' + s + '" data-active="false">' + STATUS_CHIP[s] + '</button>';
  });
  statusFilterEl.innerHTML = html;

  Array.prototype.forEach.call(statusFilterEl.querySelectorAll(".chip"), function (chip) {
    chip.addEventListener("click", function () {
      filterStatus = chip.getAttribute("data-s");
      Array.prototype.forEach.call(statusFilterEl.querySelectorAll(".chip"), function (c) {
        c.setAttribute("data-active", c.getAttribute("data-s") === filterStatus ? "true" : "false");
      });
      render();
    });
  });
}
