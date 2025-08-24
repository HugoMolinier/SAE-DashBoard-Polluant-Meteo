/**
 * Class representing a calendar.
 */
class Calendrier {
  static instanceMétéo;

  /**
   * Constructor of the Calendrier class.
   */
  constructor(instanceMétéo) {
    this.instanceMétéo = instanceMétéo;
    this.container = document.getElementById("section");
    this.currentYear = null;
    this.currentMonth = null;
    this.render();
  }

  /**
   * Pre-renders the calendar.
   */
  render() {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth() + 1; // Months start at 0 (January)
    this.renderCalendar();
  }

  /**
   * Renders the calendar.
   */
  renderCalendar() {
    const calendarEl = document.getElementById("calendar");

    // Préparer le contenu HTML
    let html = `<div id="calendar-header">
    <button class="button" id="prevMonth">&lt;</button>
    <p>${new Date(this.currentYear, this.currentMonth - 1).toLocaleString(
      "default",
      { month: "long" }
    )} ${this.currentYear}</p>
    <button class="button" id="nextMonth">&gt;</button>
  </div>`;

    html += "<table><tr>";
    ["D", "L", "Ma", "Me", "J", "V", "S"].forEach((day) => {
      html += `<th>${day}</th>`;
    });
    html += "</tr>";

    const date = new Date(this.currentYear, this.currentMonth - 1, 1);
    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth,
      0
    ).getDate();
    const firstDayIndex = date.getDay();

    let day = 1;
    const activeDate = new Date(this.instanceMétéo.date);
    const activeDay = activeDate.getDate();
    const activeMonth = activeDate.getMonth() + 1;
    const activeYear = activeDate.getFullYear();
    for (let i = 0; i < 6; i++) {
      html += "<tr>";
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayIndex) {
          html += "<td></td>";
        } else if (day > daysInMonth) {
          html += "<td></td>";
        } else {
          const isActive =
            this.currentYear === activeYear &&
            this.currentMonth === activeMonth &&
            day === activeDay;

          html += `<td><a href="#" class="day-link${
            isActive ? " active" : ""
          }">${day}</a></td>`;
          day++;
        }
      }
      html += "</tr>";
    }
    html += "</table>";

    calendarEl.innerHTML = html;

    document
      .getElementById("prevMonth")
      .addEventListener("click", () => this.prevMonth());
    document
      .getElementById("nextMonth")
      .addEventListener("click", () => this.nextMonth());

    calendarEl.querySelectorAll(".day-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.selectDate(
          this.currentYear,
          this.currentMonth,
          parseInt(link.textContent)
        );
      });
    });
  }
  /**
   * Displays the previous month in the calendar.
   */
  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 1) {
      this.currentMonth = 12;
      this.currentYear--;
    }
    this.container.removeChild(this.container.lastChild);
    this.renderCalendar();
  }

  /**
   * Displays the next month in the calendar.
   */
  nextMonth() {
    // Retrieve current date
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Check whether the current month is the same as the current calendar month
    if (this.currentYear === currentYear && this.currentMonth >= currentMonth) {
      // If yes, do not advance beyond current month
      return;
    }

    // Otherwise, advance to the following month
    this.currentMonth++;
    if (this.currentMonth > 12) {
      this.currentMonth = 1;
      this.currentYear++;
    }
    this.container.removeChild(this.container.lastChild);
    this.renderCalendar();
  }

  /**
   * Selects a date in the calendar.
   * @param {number} year - The year of the date.
   * @param {number} month - The month of the date.
   * @param {number} day - The day of the date.
   */
  selectDate(year, month, day) {
    this.instanceMétéo.setDate(getFormattedDate(`${year}-${month}-${day}`));
    this.instanceMétéo.obtenirMeteoJour();
    instanceMeteo.mettreAJourIFrame();

    // Supprime l'ancienne classe active
    this.container
      .querySelectorAll(".day-link")
      .forEach((link) => link.classList.remove("active"));

    // Ajoute la classe active à la date sélectionnée
    const clickedLink = Array.from(
      this.container.querySelectorAll(".day-link")
    ).find((link) => parseInt(link.textContent) === day);
    if (clickedLink) clickedLink.classList.add("active");
  }
}
