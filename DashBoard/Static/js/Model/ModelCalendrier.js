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
        this.container = document.getElementById('section');
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
        // Get the first day of the month and the number of days in the month
        const date = new Date(this.currentYear, this.currentMonth - 1, 1);
        const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
        const firstDayIndex = date.getDay();
    
        const weekdays = ['D', 'L', 'Ma', 'Me', 'J', 'V', 'S'];
    
        let html = document.createElement('div');// '<div id="calendar">'; // Add a div to contain buttons and calendar title
        html.id = "calendar";
        let string = '<div><button class="button" onclick="calendar.prevMonth()"><</button>'; // Previous button
        string += `<h2>${date.toLocaleString('default', { month: 'long' })} ${this.currentYear}</h2>`; // Calendar title
        string += '<button class="button" onclick="calendar.nextMonth()">></button>'; // Next button
        string += '</div>'; // Close the div
    
        // Add the table with the days of the month
        string += '<table>';
        string += '<tr>';
        weekdays.forEach(day => {
            string += `<th>${day}</th>`;
        });
        string += '</tr>';
    
        const today = new Date(); // Get the current date
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        let day = 1;

        // Add the days of the month
        for (let i = 0; i < 6; i++) {
            string += '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDayIndex) {
                    string += '<td></td>';
                } else if (day > daysInMonth) {
                    break;
                } else {
                    // Check if the day is after today
                    const isDisabled = this.currentYear > currentYear || (this.currentYear === currentYear && this.currentMonth > currentMonth) || (this.currentYear === currentYear && this.currentMonth === currentMonth && day > currentDay);
                    // Add CSS class 'disabled-link' if day is after today
                    string += `<td><a href="#" class="day-link${isDisabled ? ' disabled-link' : ''}">${day}</a></td>`;
                    day++;
                }
            }
            string += '</tr>';
        }
        string += '</table></div>';
    
        this.container.appendChild(html);
        html.innerHTML = string;
    
        // Select all links with the 'day-link' class
        const dayLinks = this.container.querySelectorAll('.day-link');
    
        // Add an onclick event handler to each link
        dayLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.selectDate(this.currentYear, this.currentMonth, parseInt(link.textContent));
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
    }
}
