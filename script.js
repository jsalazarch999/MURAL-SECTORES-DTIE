// Tarjetas de sectores + cualquier otro elemento marcado como clicable
// (por ejemplo, el paso 3 "Bienes y desarrollo" abre el sector servicios).
const cards = document.querySelectorAll(".card, .step.clickable");

const drawer = document.getElementById("drawer");
const drawerTitle = document.getElementById("drawerTitle");
const drawerSector = document.getElementById("drawerSector");
const drawerDesc = document.getElementById("drawerDesc");
const drawerList = document.getElementById("drawerList");
const drawerFlow = document.getElementById("drawerFlow");
const closeButton = document.getElementById("close");

let activeCard = null;
let pulseTimer = null;

/* ---------- Accesibilidad: preparar roles y atributos ---------- */

drawer.setAttribute("role", "dialog");
drawer.setAttribute("aria-labelledby", "drawerTitle");
drawer.setAttribute("aria-hidden", "true");
closeButton.setAttribute("aria-label", "Cerrar panel");

cards.forEach((card) => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-expanded", "false");
});

/* ---------- Posicionamiento del panel ---------- */

function positionDrawer(event, card) {
  const margin = 16;

  let clickX;
  let clickY;

  // Un clic real trae coordenadas; con teclado (o clic sintético) usamos
  // el centro de la tarjeta. Ojo: clientX puede ser 0 legítimamente, por
  // eso se comprueba el tipo y no solo la existencia del valor.
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

  // Debe estar visible para poder medirlo.
  drawer.classList.add("show");

  const drawerRect = drawer.getBoundingClientRect();

  let x = clickX;
  let y = clickY + 18;

  const minX = drawerRect.width / 2 + margin;
  const maxX = window.innerWidth - drawerRect.width / 2 - margin;
  x = Math.max(minX, Math.min(x, maxX));

  // Si no cabe hacia abajo, se abre hacia arriba.
  if (y + drawerRect.height > window.innerHeight - margin) {
    y = clickY - drawerRect.height - 18;
  }
  y = Math.max(margin, y);

  drawer.style.setProperty("--drawer-x", `${x}px`);
  drawer.style.setProperty("--drawer-y", `${y}px`);
}

/* ---------- Abrir / cerrar ---------- */

function openDrawer(card, event) {
  if (activeCard) {
    activeCard.classList.remove("active");
    activeCard.setAttribute("aria-expanded", "false");
  }

  activeCard = card;
  card.classList.add("active");
  card.setAttribute("aria-expanded", "true");

  // dataset con valores por defecto para no mostrar "undefined"
  drawerTitle.textContent = card.dataset.title || "";
  drawerSector.textContent = card.dataset.sector || "";
  drawerDesc.textContent = card.dataset.desc || "";
  drawerFlow.textContent = card.dataset.flow || "";

  // Lista opcional de actividades (data-list separada por "|").
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

  positionDrawer(event, card);
  drawer.setAttribute("aria-hidden", "false");

  // Reiniciar la animación de pulso aunque se haga clic muy rápido.
  clearTimeout(pulseTimer);
  drawer.classList.remove("pulse");
  // Forzar reflow para que la animación vuelva a dispararse.
  void drawer.offsetWidth;
  drawer.classList.add("pulse");
  pulseTimer = setTimeout(() => drawer.classList.remove("pulse"), 800);
}

function closeDrawer({ restoreFocus = false } = {}) {
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

function toggleCard(card, event) {
  // Volver a pulsar la tarjeta activa la cierra.
  if (card === activeCard) {
    closeDrawer();
  } else {
    openDrawer(card, event);
  }
}

/* ---------- Eventos ---------- */

cards.forEach((card) => {
  card.addEventListener("click", (event) => toggleCard(card, event));

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCard(card, event);
    }
  });
});

closeButton.addEventListener("click", () => closeDrawer({ restoreFocus: true }));

// Cerrar con Escape desde cualquier punto de la página.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDrawer({ restoreFocus: true });
});

// Cerrar al hacer clic fuera del panel y de las tarjetas.
document.addEventListener("click", (event) => {
  if (!drawer.classList.contains("show")) return;
  if (drawer.contains(event.target)) return;
  if (event.target.closest(".card, .step.clickable")) return;
  closeDrawer();
});

// Si cambia el tamaño de la ventana con el panel abierto, se reposiciona
// sobre la tarjeta activa para que no quede fuera de pantalla.
window.addEventListener("resize", () => {
  if (activeCard && drawer.classList.contains("show")) {
    positionDrawer(null, activeCard);
  }
});