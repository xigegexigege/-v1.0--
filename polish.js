(function () {
  "use strict";

  function addLoader() {
    if (document.getElementById("polish-loader")) return;
    var loader = document.createElement("div");
    loader.id = "polish-loader";
    loader.innerHTML = '<div class="ring"></div><div class="label">汰换模拟 · 加载中</div>';
    document.body.appendChild(loader);
    var done = false;
    function hide() {
      if (done) return;
      done = true;
      loader.classList.add("done");
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 600);
    }
    if (document.readyState === "complete") {
      setTimeout(hide, 350);
    } else {
      window.addEventListener("load", function () { setTimeout(hide, 350); });
    }
    // 兜底：即使出现异常也在 4 秒后收起
    setTimeout(hide, 4000);
  }

  function setTitle() {
    try {
      document.title = "汰换模拟 v1.0 · 高保真原型";
    } catch (e) {}
  }

  function decorateSidebar() {
    var panel = document.querySelector(".preview-controller-panel");
    if (!panel) return false;
    if (document.querySelector(".polish-sidebar-header")) return true;

    var header = document.createElement("div");
    header.className = "polish-sidebar-header";
    header.innerHTML =
      '<div class="polish-logo">汰换模拟</div>' +
      '<div class="polish-sub">高保真交互原型 · 13 个页面</div>';
    panel.insertBefore(header, panel.firstChild);

    var footer = document.createElement("div");
    footer.className = "polish-sidebar-footer";
    footer.textContent = "点击页面名称可切换页面，页面内原有交互全部保留。";
    panel.appendChild(footer);
    return true;
  }

  function ensureSidebar() {
    if (decorateSidebar()) return;
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (decorateSidebar() || tries > 50) {
        clearInterval(timer);
      }
    }, 100);
  }

  function currentPageId() {
    var m = location.hash.match(/^#\/offline\/([^/?]+)/);
    return m ? m[1] : "";
  }

  function queryString() {
    var m = location.hash.match(/\?(.*)$/);
    if (m) return "?" + m[1];
    return "?cps=collapse&rps=collapse&nav=1&ha=0&la=0&fc=1&dt=iphoneX&out=0&rt=1";
  }

  function buildMobileNav() {
    if (document.querySelector(".polish-fab")) return;
    var pages = (window.app && window.app.children) || [];
    if (!pages.length) return;

    var tops = pages.filter(function (p) { return p.path === "ROOT"; });

    function itemHTML(p, isChild) {
      return (
        '<button class="polish-nav-item' + (isChild ? " child" : "") + '" data-id="' + p._id + '">' +
        '<span class="dot"></span><span>' + p.name + "</span></button>"
      );
    }

    var listHTML = "";
    tops.forEach(function (top) {
      listHTML += '<div class="polish-nav-group">' + top.name + "</div>";
      listHTML += itemHTML(top, false);
      pages.forEach(function (p) {
        if (p.path === "ROOT," + top._id) {
          listHTML += itemHTML(p, true);
        }
      });
    });

    var overlay = document.createElement("div");
    overlay.className = "polish-nav-overlay";
    overlay.innerHTML =
      '<div class="polish-nav-panel">' +
      '<div class="polish-nav-head">' +
      '<div class="polish-nav-title">页面导航</div>' +
      '<button class="polish-nav-close" aria-label="关闭">✕</button>' +
      "</div>" +
      '<div class="polish-nav-list">' + listHTML + "</div>" +
      "</div>";
    document.body.appendChild(overlay);

    var fab = document.createElement("button");
    fab.className = "polish-fab";
    fab.setAttribute("aria-label", "页面导航");
    fab.innerHTML =
      '<svg viewBox="0 0 24 24"><line x1="4" y1="7" x2="20" y2="7"></line>' +
      '<line x1="4" y1="12" x2="20" y2="12"></line>' +
      '<line x1="4" y1="17" x2="20" y2="17"></line></svg>';
    document.body.appendChild(fab);

    function refreshActive() {
      var id = currentPageId();
      overlay.querySelectorAll(".polish-nav-item").forEach(function (el) {
        el.classList.toggle("active", el.getAttribute("data-id") === id);
      });
    }

    fab.addEventListener("click", function () {
      refreshActive();
      overlay.classList.add("open");
    });
    overlay.querySelector(".polish-nav-close").addEventListener("click", function () {
      overlay.classList.remove("open");
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.classList.remove("open");
    });
    overlay.querySelectorAll(".polish-nav-item").forEach(function (el) {
      el.addEventListener("click", function () {
        var id = el.getAttribute("data-id");
        location.hash = "#/offline/" + id + queryString();
        overlay.classList.remove("open");
      });
    });
    window.addEventListener("hashchange", refreshActive);
  }

  addLoader();
  setTitle();
  ensureSidebar();
  buildMobileNav();
  // 页面运行时可能会重写标题，延后再纠正一次
  setTimeout(setTitle, 1200);
})();
