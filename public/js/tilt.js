function attachTilt(el) {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wrap = el.closest(".card-wrap") || el.parentElement;
  var art  = el.querySelector(".card-art-full");

  el.addEventListener("pointermove", function (e) {
    if (wrap && wrap.classList.contains("flipped")) return;

    var r  = el.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width;
    var py = (e.clientY - r.top)  / r.height;

    el.style.setProperty("--glow-x", (px * 100) + "%");
    el.style.setProperty("--glow-y", (py * 100) + "%");

    if (!reduce) {
      el.style.transform =
        "perspective(1000px)" +
        " rotateY(" + (px - .5) * 10 + "deg)" +
        " rotateX(" + (.5 - py) * 10 + "deg)" +
        " scale(1.03)";

      if (art) art.style.transform =
        "scale(1.1) translate(" + (px - .5) * -6 + "px, " + (py - .5) * -6 + "px)";
    }
  });

  el.addEventListener("pointerleave", function () {
    el.style.removeProperty("transform");
    if (art) art.style.removeProperty("transform");
  });
}
