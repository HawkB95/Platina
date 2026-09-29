// ===============================================
// FORM ADD / EDIT GIOCHI
// ===============================================

function openForm(card) {
  editingId = card ? card.id : null;
  document.getElementById("form-title").textContent = card ? "Modifica gioco" : "Aggiungi gioco";
  document.getElementById("f-save").textContent = card ? "SALVA MODIFICHE" : "AGGIUNGI ALLA COLLEZIONE";

  document.getElementById("rawg-box").style.display = card ? "none" : "block";

  rawgInput.value = "";
  rawgResults.classList.remove("show");
  rawgResults.innerHTML = "";

  document.getElementById("f-title").value = card ? card.title : "";
  setSelectedStatus(card ? statusOf(card) : "completed");

  var allowedPlat = ["PlayStation", "Xbox", "Game Pass", "Steam", "GOG"];
  document.getElementById("f-platform").value = (card && allowedPlat.indexOf(card.platform) > -1) ? card.platform : "PlayStation";
  document.getElementById("f-year").value = card ? (card.releaseDate || (card.year ? String(card.year) : "")) : "";
  document.getElementById("f-cover").value = card ? (card.cover || "") : "";
  document.getElementById("f-developer").value = card ? (card.developer || "") : "";
  document.getElementById("f-score").value = card ? (card.score != null ? card.score : "") : "";
  document.getElementById("f-description").value = card ? (card.description || "") : "";
  document.getElementById("f-tags").value = card ? (card.tags || "") : "";

  openOverlay("form-overlay");

  setTimeout(function () {
    (card ? document.getElementById("f-platform") : rawgInput).focus();
  }, 50);
}

function initFormSubmit() {
  document.getElementById("btn-add").addEventListener("click", function () {
    openForm(null);
  });

  document.getElementById("f-save").addEventListener("click", function () {
    var title = document.getElementById("f-title").value.trim();
    if (!title) return;

    var rawDate = document.getElementById("f-year").value.trim();
    var releaseDate = rawDate || null;
    var year = releaseDate ? (parseInt(releaseDate.slice(0, 4), 10) || null) : null;
    var scoreRaw = parseFloat(document.getElementById("f-score").value);
    var data = {
      title: title,
      status: selectedStatus,
      platform: document.getElementById("f-platform").value,
      year: year,
      releaseDate: releaseDate,
      cover: document.getElementById("f-cover").value.trim(),
      developer: document.getElementById("f-developer").value.trim() || null,
      score: isNaN(scoreRaw) ? null : scoreRaw,
      description: document.getElementById("f-description").value.trim() || null,
      tags: document.getElementById("f-tags").value.trim() || null
    };

    closeOverlay("form-overlay");

    if (editingId) {
      var i = collection.findIndex(function (c) { return c.id === editingId; });
      if (i > -1) {
        collection[i] = Object.assign({}, collection[i], data);
        collection[i].status = statusOf(collection[i]);
      }
      saveCollection();
      render();
    } else {
      var card = Object.assign({
        id: "c" + Date.now() + Math.floor(Math.random() * 999),
        dateAdded: Date.now()
      }, data);
      card.status = statusOf(card);
      collection.unshift(card);
      saveCollection();
      render();
      playReveal();
    }
  });
}
