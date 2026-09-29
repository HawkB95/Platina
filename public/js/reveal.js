var toastTimer = null;

function playReveal() {
  var toast = document.getElementById("add-toast");
  toast.classList.remove("toast-out");
  toast.classList.add("toast-in");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("toast-in");
    toast.classList.add("toast-out");
  }, 1250);
}
