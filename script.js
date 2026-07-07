const cards = document.querySelectorAll(".card");

const drawer = document.getElementById("drawer");
const drawerTitle = document.getElementById("drawerTitle");
const drawerSector = document.getElementById("drawerSector");
const drawerDesc = document.getElementById("drawerDesc");
const drawerFlow = document.getElementById("drawerFlow");
const closeButton = document.getElementById("close");

function selectCard(card) {
  cards.forEach((item) => {
    item.classList.remove("active");
  });

  card.classList.add("active");

  drawerTitle.textContent = card.dataset.title;
  drawerSector.textContent = card.dataset.sector;
  drawerDesc.textContent = card.dataset.desc;
  drawerFlow.textContent = card.dataset.flow;

  drawer.classList.add("show", "pulse");

  setTimeout(() => {
    drawer.classList.remove("pulse");
  }, 800);
}

cards.forEach((card) => {
  card.addEventListener("click", () => {
    selectCard(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectCard(card);
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