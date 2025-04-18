// search
const search = document.querySelector("[data-search]");
const btnSearch = document.querySelector("[data-btn-search]");
if (search) {
  const searchTab = search.querySelector("[data-searchBar]");
  const searchInput = searchTab.querySelector("input");
  const backBtn = searchTab.querySelector("[data-back-btn]");
  const resultSearch = search.querySelector("[data-result-search]");
  const clearSearch = search.querySelector("[data-clear-search]");

  function toggleSearch() {
    searchTab.classList.toggle("hidden");

    if (!searchTab.classList.contains("hidden")) {
      searchInput.focus();
    } else {
      searchInput.value = "";
      resultSearch.classList.replace("flex", "hidden");
    }
  }

  function clearSearchInput() {
    searchInput.value = "";
    resultSearch.classList.replace("flex", "hidden");
    searchInput.focus();
    clearSearch.classList.add("hidden");
  }

  btnSearch.addEventListener("click", toggleSearch);
  backBtn?.addEventListener("click", toggleSearch);

  clearSearch?.addEventListener("click", clearSearchInput);

  searchInput.addEventListener("input", (e) => {
    if (searchInput.value.length > 0) {
      resultSearch.classList.replace("hidden", "flex");

      clearSearch?.classList.remove("hidden");
    } else {
      resultSearch.classList.replace("flex", "hidden");
      clearSearch?.classList.add("hidden");
    }
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchTab.classList.add("hidden");

      resultSearch.classList.replace("flex", "hidden");
      searchInput.value = "";
    }
  });
}

// modal
const modalLogin = document.querySelector(`[data-modal-login]`);
if (modalLogin) {
  const modal = (() => {
    let publicAPIs = {};

    let settings = {
      speedOpen: 50,
      speedClose: 250,
      toggleClass: "hidden",
      selectorTarget: "[data-modal-target]",
      selectorTrigger: "[data-modal-trigger]",
      selectorClose: "[data-modal-close]",
      selectorOverlay: "[data-modal-overlay]",
      selectorWrapper: "[data-modal-wrapper]",
      selectorInputFocus: "[data-modal-input-focus]",
    };

    if (!Element.prototype.closest) {
      if (!Element.prototype.matches) {
        Element.prototype.matches =
          Element.prototype.msMatchesSelector ||
          Element.prototype.webkitMatchesSelector;
      }
      Element.prototype.closest = function (s) {
        let el = this;
        let ancestor = this;
        if (!document.documentElement.contains(el)) return null;
        do {
          if (ancestor.matches(s)) return ancestor;
          ancestor = ancestor.parentElement;
        } while (ancestor !== null);
        return null;
      };
    }

    function trapFocus(element) {
      let focusableEls = element.querySelectorAll(
        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
      );
      let firstFocusableEl = focusableEls[0];
      let lastFocusableEl = focusableEls[focusableEls.length - 1];
      let KEYCODE_TAB = 9;

      element.addEventListener("keydown", function (e) {
        let isTabPressed = e.key === "Tab" || e.keyCode === KEYCODE_TAB;

        if (!isTabPressed) {
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
            e.preventDefault();
          }
        }
      });
    }

    let toggleccessibility = function (event) {
      if (event.getAttribute("aria-expanded") === "true") {
        event.setAttribute("aria-expanded", false);
      } else {
        event.setAttribute("aria-expanded", true);
      }
    };

    let openModal = function (event, destination) {
      let target = destination;

      if (typeof event === "string") {
        target = document.getElementById(event);

        if (target) {
          target.setAttribute("data-auto-trigger", "");
        }
      }

      if (!target) return;

      let overlay = target.querySelector(settings.selectorOverlay),
        wrapper = target.querySelector(settings.selectorWrapper),
        input = target.querySelector(settings.selectorInputFocus);

      target.classList.remove(settings.toggleClass);

      document.documentElement.style.overflow = "hidden";

      if (typeof event !== "string") {
        toggleccessibility(event);
      }

      setTimeout(function () {
        if (overlay) {
          let overlayIn = overlay.getAttribute("data-class-in").split(" "),
            overlayOut = overlay.getAttribute("data-class-out").split(" ");
          overlay.classList.remove(...overlayOut);
          overlay.classList.add(...overlayIn);
        }

        if (wrapper) {
          let wrapperIn = wrapper.getAttribute("data-class-in").split(" "),
            wrapperOut = wrapper.getAttribute("data-class-out").split(" ");
          wrapper.classList.remove(...wrapperOut);
          wrapper.classList.add(...wrapperIn);
        }

        if (input) {
          input.focus();
        }

        trapFocus(target);
      }, settings.speedOpen);
    };

    let closeModal = function (event) {
      let closestParent = event.closest(settings.selectorTarget),
        trigger = document.querySelector(
          '[aria-controls="' + closestParent.id + '"'
        ),
        overlay = closestParent.querySelector(settings.selectorOverlay),
        wrapper = closestParent.querySelector(settings.selectorWrapper);

      if (trigger === null) {
        trigger = document.querySelector('a[href="#' + closestParent.id + '"');
      }

      if (overlay) {
        let overlayIn = overlay.getAttribute("data-class-in").split(" "),
          overlayOut = overlay.getAttribute("data-class-out").split(" ");
        overlay.classList.remove(...overlayIn);
        overlay.classList.add(...overlayOut);
      }

      if (wrapper) {
        let wrapperIn = wrapper.getAttribute("data-class-in").split(" "),
          wrapperOut = wrapper.getAttribute("data-class-out").split(" ");
        wrapper.classList.remove(...wrapperIn);
        wrapper.classList.add(...wrapperOut);
      }

      document.documentElement.style.overflow = "";

      if (closestParent.hasAttribute("data-auto-trigger")) {
        closestParent.removeAttribute("data-auto-trigger");
      } else {
        toggleccessibility(trigger);
      }

      setTimeout(function () {
        closestParent.classList.add(settings.toggleClass);
      }, settings.speedClose);
    };

    let clickHandler = function (event) {
      let toggle = event.target,
        trigger,
        target,
        closestButton = toggle.closest("button"),
        closest = toggle.closest("a"),
        open = null;

      if (
        toggle.hasAttribute("data-modal-trigger") &&
        toggle.hasAttribute("aria-controls")
      ) {
        trigger = toggle.closest(settings.selectorTrigger);
        target = document.getElementById(trigger.getAttribute("aria-controls"));
        open = true;
      } else if (
        closestButton &&
        closestButton.hasAttribute("data-modal-trigger") &&
        closestButton.hasAttribute("aria-controls")
      ) {
        trigger = toggle.closest(settings.selectorTrigger);
        target = document.getElementById(trigger.getAttribute("aria-controls"));
        open = true;
      } else if (toggle.hash && toggle.hash.substr(1).indexOf("modal") > -1) {
        trigger = toggle;
        target = document.getElementById(toggle.hash.substr(1));
        open = true;
      } else if (
        closest &&
        closest.hash &&
        closest.hash.substr(1).indexOf("modal") > -1
      ) {
        trigger = closest;
        target = document.getElementById(closest.hash.substr(1));
        open = true;
      }

      let close = toggle.closest(settings.selectorClose);

      if (open && target) {
        openModal(trigger, target);
      }

      if (close) {
        closeModal(close);
      }

      if (open || close) {
        event.preventDefault();
      }
    };

    let keydownHandler = function (event) {
      if (event.key === "Escape" || event.keyCode === 27) {
        let modals = document.querySelectorAll(settings.selectorTarget),
          i;

        for (i = 0; i < modals.length; ++i) {
          if (!modals[i].classList.contains(settings.toggleClass)) {
            closeModal(modals[i]);
          }
        }
      }
    };

    publicAPIs.init = function () {
      document.addEventListener("click", clickHandler, false);
      document.addEventListener("keydown", keydownHandler, false);
    };

    publicAPIs.openModal = openModal;
    publicAPIs.closeModal = closeModal;

    return publicAPIs;
  })();

  document.addEventListener("DOMContentLoaded", function () {
    modal.init();
  });
}

// Dropdown
document.addEventListener("alpine:init", () => {
  Alpine.data("app", () => ({
    // State management
    isLoggedIn: false,
    userDropdownOpen: false,
    showLoginModal: false,
    loginForm: {
      email: "",
      password: "",
      remember: false,
    },

    init() {
      // Check if user is already logged in (from localStorage)
      if (localStorage.getItem("isLoggedIn") === "true") {
        this.isLoggedIn = true;
      }
    },

    login() {
      // Simple validation
      if (!this.loginForm.email || !this.loginForm.password) {
        alert("Please fill in all fields");
        return;
      }

      // Here you would typically make an API call
      console.log("Logging in with:", this.loginForm);

      // Simulate successful login
      this.isLoggedIn = true;
      this.showLoginModal = false;
      this.userDropdownOpen = false;

      // Store login state
      if (this.loginForm.remember) {
        localStorage.setItem("isLoggedIn", "true");
      }

      // Reset form
      this.loginForm = {
        email: "",
        password: "",
        remember: false,
      };
    },

    logout() {
      this.isLoggedIn = false;
      this.userDropdownOpen = false;
      localStorage.removeItem("isLoggedIn");
    },
  }));
});

const sidebar = document.querySelector("[data-sidebar]");
if (sidebar) {
  const toggleSidebar = sidebar.querySelector("[data-sb-button]");
  const sbMenu = sidebar.querySelector("[data-sb-menu]");
  const support = sidebar.querySelector("[data-support]");
  const supMobile = sidebar.querySelector("[data-support-mobile]");
  const main = document.querySelector("[data-main]");

  if (toggleSidebar && sbMenu) {
    const sbNames = sbMenu.querySelectorAll("div div a span");

    toggleSidebar.onclick = () => {
      const isExpanded = sidebar.classList.contains("w-64");
      const btnPosition = sidebar.querySelector("[data-sb-menu] div");

      // button position
      toggleSidebar.classList.toggle("justify-end");
      toggleSidebar.classList.toggle("bg-button");
      if (isExpanded) {
        btnPosition.classList.replace("right-4", "right-6");
      } else {
        btnPosition.classList.replace("right-6", "right-4");
      }

      // sidebar wide
      sidebar.classList.replace(
        isExpanded ? "w-64" : "w-20",
        isExpanded ? "w-20" : "w-64"
      );

      // hide/show menu text
      sbNames.forEach((sbname) => {
        if (isExpanded) {
          sbname.classList.replace("scale-100", "scale-0");
          sbname.classList.replace("delay-200", "delay-0");
        } else {
          sbname.classList.replace("scale-0", "scale-100");
          sbname.classList.replace("delay-0", "delay-200");
        }
      });

      // hide/show support
      if (isExpanded) {
        support.classList.replace("scale-100", "scale-0");
        support.classList.replace("h-auto", "h-0");
        supMobile.classList.replace("scale-0", "scale-100");
        support.classList.replace("delay-200", "delay-0");
      } else {
        support.classList.replace("scale-0", "scale-100");
        support.classList.replace("h-0", "h-auto");
        supMobile.classList.replace("scale-100", "scale-0");
        support.classList.replace("delay-0", "delay-200");
      }
      if (isExpanded) {
        main.classList.replace("md:pl-64", "md:pl-20");
      } else {
        main.classList.replace("md:pl-20", "md:pl-64");
      }
    };
  }
}
