// ===============================================
// INSPECTOR - VISUALIZZA DETTAGLI CARTA
// ===============================================

function openDetail(id) {
  var c = collection.find(function (x) { return x.id === id; });
  if (!c) return;

  var s = statusOf(c);
  var body =
    '<div class="card-wrap card-lg-wrap" data-s="' + s + '" data-id="' + c.id + '">' +
      '<div class="card-glow"></div>' +
      '<div class="card-flipper">' +
        '<div class="card" data-s="' + s + '">' + cardInner(c, s) + '</div>' +
        cardBack(c, s) +
      '</div>' +
    '</div>';

  document.getElementById("detail-body").innerHTML = body;
  openOverlay("detail-overlay");

  var wrap = document.querySelector("#detail-body .card-wrap");

  if (wrap) {
    wrap.addEventListener("click", function (e) {
      if (e.target.closest(".card-back-edit") || e.target.closest(".card-back-del")) return;
      wrap.classList.toggle("flipped");
    });
  }

  var editBtn = document.querySelector("#detail-body .card-back-edit");
  if (editBtn) {
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeOverlay("detail-overlay");
      openForm(c);
    });
  }

  var delBtn = document.querySelector("#detail-body .card-back-del");
  if (delBtn) {
    delBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      showConfirm(c.title, function () {
        collection = collection.filter(function (x) { return x.id !== c.id; });
        saveCollection();
        closeOverlay("detail-overlay");
        render();
      });
    });
  }
}
