// menu.js — Export / Import da localStorage

function initMenuButtons() {
  // Dropdown ··· toggle
  var btnMenu = document.getElementById("btn-menu");
  var libDropdown = document.getElementById("lib-dropdown");

  btnMenu.addEventListener("click", function (e) {
    e.stopPropagation();
    var opening = !libDropdown.classList.contains("open");
    libDropdown.classList.toggle("open", opening);
    btnMenu.classList.toggle("active", opening);
  });

  document.addEventListener("click", function () {
    libDropdown.classList.remove("open");
    btnMenu.classList.remove("active");
  });

  libDropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  function closeMenu() {
    libDropdown.classList.remove("open");
    btnMenu.classList.remove("active");
  }

  // Export: scarica la collezione come file JSON
  document.getElementById("btn-export").addEventListener("click", function () {
    closeMenu();
    if (!collection.length) {
      alert("La collezione è vuota, niente da esportare.");
      return;
    }
    var blob = new Blob([JSON.stringify(collection, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "platina-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // Import: apre il selettore file
  document.getElementById("btn-import-trigger").addEventListener("click", function () {
    closeMenu();
    document.getElementById("import-file").click();
  });

  document.getElementById("import-file").addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error();
        if (collection.length && !confirm("Sostituire la collezione attuale (" + collection.length + " giochi) con il file importato (" + data.length + " giochi)?")) return;
        collection = data.map(function (g) {
          g.status = statusOf(g);
          return g;
        });
        saveCollection();
        render();
      } catch (err) {
        alert("File non valido. Assicurati di usare un file .json esportato da Platina.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  });
}
