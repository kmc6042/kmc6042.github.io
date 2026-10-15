(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem("theme") || "light";

  function systemDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyTheme(mode) {
    var dark = mode === "dark" || (mode === "auto" && systemDark());
    root.classList.toggle("dark", dark);
    localStorage.setItem("theme", mode);
  }

  applyTheme(stored);

  document.querySelectorAll("[data-theme]").forEach(function (button) {
    button.addEventListener("click", function () {
      applyTheme(button.getAttribute("data-theme"));
    });
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if ((localStorage.getItem("theme") || "light") === "auto") applyTheme("auto");
  });

  var params = new URLSearchParams(window.location.search);
  if (params.get("theme")) applyTheme(params.get("theme"));

  var search = document.getElementById("search");
  var input = document.getElementById("search-query");
  var hits = document.getElementById("search-hits");

  function indexItems() {
    return Array.prototype.map.call(document.querySelectorAll("[data-search]"), function (node) {
      return {
        title: node.getAttribute("data-search"),
        text: node.innerText.replace(/\s+/g, " ").trim(),
        href: node.id ? "#" + node.id : "#top"
      };
    });
  }

  function openSearch(event) {
    if (event) event.preventDefault();
    search.classList.add("open");
    input.value = "";
    hits.innerHTML = "";
    input.focus();
  }

  function closeSearch(event) {
    if (event) event.preventDefault();
    search.classList.remove("open");
  }

  document.querySelectorAll(".js-search").forEach(function (link) {
    link.addEventListener("click", openSearch);
  });

  document.querySelectorAll(".js-search-close").forEach(function (link) {
    link.addEventListener("click", closeSearch);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeSearch();
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") openSearch(event);
  });

  input.addEventListener("input", function () {
    var query = input.value.trim().toLowerCase();
    hits.innerHTML = "";
    if (!query) return;
    indexItems().forEach(function (item) {
      var blob = (item.title + " " + item.text).toLowerCase();
      if (blob.indexOf(query) === -1) return;
      var link = document.createElement("a");
      link.className = "search-hit";
      link.href = item.href;
      var title = document.createElement("strong");
      title.textContent = item.title;
      var snippet = document.createElement("span");
      snippet.textContent = item.text.slice(0, 180);
      link.appendChild(title);
      link.appendChild(snippet);
      link.addEventListener("click", closeSearch);
      hits.appendChild(link);
    });
    if (!hits.childElementCount) {
      hits.innerHTML = "<p class='text-muted mt-3'>No results.</p>";
    }
  });

  if (window.jQuery) {
    window.jQuery("body").scrollspy({ target: "#navbar-main", offset: 90 });
  }
})();
