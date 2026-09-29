// ===============================================
// FUNZIONI HELPER UTILITY
// ===============================================

/**
 * Estrae lo status di una carta, con fallback a "backlog"
 */
function statusOf(c) {
  return (c && STATUS_ORDER[c.status] != null) ? c.status : "backlog";
}

/**
 * Hash string per generare colori deterministici
 */
function hashStr(s) {
  var h = 0;
  for (var i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Genera un gradient lineare basato sul titolo del gioco
 */
function gradientFor(t) {
  var h = hashStr(t || "?");
  var a = h % 360;
  var b = (a + 50 + (h % 80)) % 360;
  return "linear-gradient(145deg, hsl(" + a + ",55%,32%), hsl(" + b + ",60%,18%))";
}

/**
 * Estrae le iniziali dal titolo
 */
function initials(t) {
  var p = (t || "?").trim().split(/\s+/);
  return p.length === 1 ? p[0].slice(0, 2).toUpperCase() : (p[0][0] + p[1][0]).toUpperCase();
}

/**
 * Escape HTML per sicurezza
 */
function escapeHtml(s) {
  return (s == null ? "" : String(s)).replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m];
  });
}

/**
 * Converte URL in CSS url()
 */
function cssUrl(u) {
  return "url('" + String(u).replace(/'/g, "%27") + "')";
}

var MONTHS_IT = ["gennaio","febbraio","marzo","aprile","maggio","giugno",
                 "luglio","agosto","settembre","ottobre","novembre","dicembre"];

/**
 * Formatta la data di rilascio: "2020-09-17" → "17 settembre 2020", "2020" → "2020"
 */
function formatReleaseDate(c) {
  var rd = c.releaseDate;
  if (rd) {
    var parts = rd.split("-");
    if (parts.length === 3) {
      var d = parseInt(parts[2], 10);
      var m = parseInt(parts[1], 10) - 1;
      var y = parts[0];
      if (MONTHS_IT[m]) return d + " " + MONTHS_IT[m] + " " + y;
    }
    return rd;
  }
  return c.year ? String(c.year) : null;
}
