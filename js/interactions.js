/* ============================================
   interactions.js — Elementos interactivos
   Responsable de: decidir QUÉ abre el panel
   (tarjetas y pasos clicables) y con qué
   eventos (clic, teclado, Escape, clic fuera).
   Depende de AppDrawer (cargar drawer.js antes).
   ============================================ */

(() => {
  // Un solo lugar para definir qué es interactivo.
  // Para agregar un nuevo elemento clicable basta con darle la clase
  // "clickable" (o "card") y sus data-atributos en el HTML.
  const TRIGGER_SELECTOR = ".card, .step.clickable";

  const triggers = document.querySelectorAll(TRIGGER_SELECTOR);

  triggers.forEach((trigger) => {
    /* Accesibilidad de cada disparador */
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-expanded", "false");

    /* Clic */
    trigger.addEventListener("click", (event) => {
      AppDrawer.toggle(trigger, event);
    });

    /* Teclado: Enter o Espacio */
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        AppDrawer.toggle(trigger, event);
      }
    });
  });

  /* Escape cierra desde cualquier punto de la página */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") AppDrawer.close({ restoreFocus: true });
  });

  /* Clic fuera del panel (y fuera de los disparadores) lo cierra */
  document.addEventListener("click", (event) => {
    if (!AppDrawer.isOpen()) return;
    if (AppDrawer.contains(event.target)) return;
    if (event.target.closest(TRIGGER_SELECTOR)) return;
    AppDrawer.close();
  });

  /* Si cambia el tamaño de la ventana, reposicionar el panel */
  window.addEventListener("resize", () => AppDrawer.reposition());
})();
