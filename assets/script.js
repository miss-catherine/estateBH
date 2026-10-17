const navLinks = document.querySelector(".nav-links");
const menuOpenButton = document.querySelector(".bx-menu");
const menuCloseButton = document.querySelector(".sidebar-logo .bx-x");

menuOpenButton?.addEventListener("click", () => {
  navLinks?.classList.add("show");
});

menuCloseButton?.addEventListener("click", () => {
  navLinks?.classList.remove("show");
  navLinks?.querySelectorAll(".submenu-open").forEach((item) => {
    item.classList.remove("submenu-open");
  });
});

document.querySelectorAll(".arrow").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    arrow.closest("li")?.classList.toggle("submenu-open");
  });
});
