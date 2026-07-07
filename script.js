const cards = document.querySelectorAll(".card");

const drawer = document.getElementById("drawer");
const drawerTitle = document.getElementById("drawerTitle");
const drawerSector = document.getElementById("drawerSector");
const drawerDesc = document.getElementById("drawerDesc");
const drawerFlow = document.getElementById("drawerFlow");
const closeButton = document.getElementById("close");

function positionDrawer(event, card) {
  const margin = 16;

  let clickX;
  let clickY;

  if (event && event.clientX && event.clientY) {
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

  if (y < margin) {
    y = margin;
  }

  drawer.style.setProperty("--drawer-x", `${x}px`);
  drawer.style.setProperty("--drawer-y", `${y}px`);
}

function selectCard(card, event) {
  cards.forEach((item) => {
    item.classList.remove("active");
  });

  card.classList.add("active");

  drawerTitle.textContent = card.dataset.title;
  drawerSector.textContent = card.dataset.sector;
  drawerDesc.textContent = card.dataset.desc;
  drawerFlow.textContent = card.dataset.flow;

  positionDrawer(event, card);

  drawer.classList.add("pulse");

  setTimeout(() => {
    drawer.classList.remove("pulse");
  }, 800);
}

cards.forEach((card) => {
  card.addEventListener("click", (event) => {
    selectCard(card, event);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectCard(card, event);
    }
  });

  card.setAttribute("tabindex", "0");
});

closeButton.addEventListener("click", () => {
  drawer.classList.remove("show");

  cards.forEach((card) => {
    card.classList.remove("active");
  });
});