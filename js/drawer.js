/* ============================================
   drawer.js — Panel emergente
   Responsable de: abrir, cerrar, posicionar y
   rellenar el panel. No sabe nada de tarjetas:
   recibe cualquier elemento con data-atributos.
   Expone el objeto global AppDrawer.
   ============================================ */

const AppDrawer = (() => {
  const drawer = document.getElementById("drawer");
  const drawerTitle = document.getElementById("drawerTitle");
  const drawerSector = document.getElementById("drawerSector");
  const drawerDesc = document.getElementById("drawerDesc");
  const drawerList = document.getElementById("drawerList");
  const drawerFlow = document.getElementById("drawerFlow");
  const closeButton = document.getElementById("close");

  let activeCard = null;
  let pulseTimer = null;

  /* --- Accesibilidad del panel --- */
  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-labelledby", "drawerTitle");
  drawer.setAttribute("aria-hidden", "true");

  /* --- Posicionamiento cerca del clic, sin salirse de la pantalla --- */
  function position(event, card) {
    const margin = 16;

    let clickX;
    let clickY;

    const hasCoords =
      event &&
      typeof event.clientX === "number" &&
      typeof event.clientY === "number" &&
      (event.clientX !== 0 || event.clientY !== 0);

    if (hasCoords) {
      clickX = event.clientX;
      clickY = event.clientY;
    } else {
      const rect = card.getBoundingClientRect();
      clickX = rect.left + rect.width / 2;
      clickY = rect.top + rect.height / 2;
    }

    drawer.classList.add("show");

    const drawerRect = drawer.getBoundingClientRect();

    let x = clickX;
    let y = clickY + 18;

    const minX = drawerRect.width / 2 + margin;
    const maxX = window.innerWidth - drawerRect.width / 2 - margin;
    x = Math.max(minX, Math.min(x, maxX));

    if (y + drawerRect.height > window.innerHeight - margin) {
      y = clickY - drawerRect.height - 18;
    }
    y = Math.max(margin, y);

    drawer.style.setProperty("--drawer-x", `${x}px`);
    drawer.style.setProperty("--drawer-y", `${y}px`);
  }

  /* --- Rellenar el contenido desde los data-atributos --- */
  function fill(card) {
    drawerTitle.textContent = card.dataset.title || "";
    drawerSector.textContent = card.dataset.sector || "";
    drawerDesc.textContent = card.dataset.desc || "";
    drawerFlow.textContent = card.dataset.flow || "";

    drawerList.innerHTML = "";
    if (card.dataset.list) {
      card.dataset.list.split("|").forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.trim();
        drawerList.appendChild(li);
      });
      drawerList.hidden = false;
    } else {
      drawerList.hidden = true;
    }
  }

  function pulse() {
    clearTimeout(pulseTimer);
    drawer.classList.remove("pulse");
    void drawer.offsetWidth; // forzar reflow para reiniciar la animación
    drawer.classList.add("pulse");
    pulseTimer = setTimeout(() => drawer.classList.remove("pulse"), 800);
  }

  /* --- API pública --- */

  function open(card, event) {
    if (activeCard) {
      activeCard.classList.remove("active");
      activeCard.setAttribute("aria-expanded", "false");
    }

    activeCard = card;
    card.classList.add("active");
    card.setAttribute("aria-expanded", "true");

    fill(card);
    position(event, card);
    drawer.setAttribute("aria-hidden", "false");
    pulse();
  }

  function close({ restoreFocus = false } = {}) {
    if (!drawer.classList.contains("show")) return;

    drawer.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");

    if (activeCard) {
      activeCard.classList.remove("active");
      activeCard.setAttribute("aria-expanded", "false");
      if (restoreFocus) activeCard.focus();
      activeCard = null;
    }
  }

  function toggle(card, event) {
    if (card === activeCard) {
      close();
    } else {
      open(card, event);
    }
  }

  function reposition() {
    if (activeCard && drawer.classList.contains("show")) {
      position(null, activeCard);
    }
  }

  function isOpen() {
    return drawer.classList.contains("show");
  }

  function contains(target) {
    return drawer.contains(target);
  }

  closeButton.addEventListener("click", () => close({ restoreFocus: true }));

  return { open, close, toggle, reposition, isOpen, contains };
})();
