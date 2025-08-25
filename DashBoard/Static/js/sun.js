// Add event listener to the gear option to change the theme of the dashboard
document.getElementById("gear-option").addEventListener("click", () => {
  if (document.getElementById("sun_night").href.endsWith("/css/night.css")) {
    document
      .getElementById("sun_night")
      .setAttribute("href", "./dashboard/css/sun.css");
    document
      .getElementById("gear-option")
      .setAttribute("src", "./dashboard/img/gear_option_night.png");
    document
      .getElementById("menu")
      .setAttribute("src", "./dashboard/img/menu_night.png");
  } else {
    document
      .getElementById("sun_night")
      .setAttribute("href", "./dashboard/css/night.css");
    document
      .getElementById("gear-option")
      .setAttribute("src", "./dashboard/img/gear_option_night.png");
    document
      .getElementById("menu")
      .setAttribute("src", "./dashboard/img/menu_night.png");
  }
});
