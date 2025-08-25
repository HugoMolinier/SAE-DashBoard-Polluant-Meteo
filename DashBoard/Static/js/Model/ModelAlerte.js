/**
 * Class representing an alert.
 */
class ModelAlerte {
  /**
   * List containing all alert instances.
   * @type {ModelAlerte[]}
   */
  static allInstances = [];

  /**
   * Constructor of the ModelAlerte class.
   * @param {string} polluant - The pollutant.
   * @param {Date} date - The date of the alert.
   * @param {string} message - The alert message.
   */
  constructor(polluant, date, valeur, seuil) {
    this.polluant = polluant;
    this.date = date;
    this.valeur = valeur;
    this.seuil = seuil;
    ModelAlerte.allInstances.push(this);
  }

  /**
   * Gets all alert instances.
   * @returns {ModelAlerte[]} All alert instances.
   */
  static getAllInstances() {
    return ModelAlerte.allInstances;
  }

  /**
   * Set the alert date.
   * @param {Date} date - The new alert date.
   */
  setPolluant(polluant) {
    this.polluant = polluant;
  }

  /**
   * Gets the alert date.
   * @returns {Date} The date of the alert.
   */
  getPolluant() {
    return this.polluant;
  }

  /**
   * Suppresses alerts relating to a specific date and pollutant.
   * @param {Date} date - The date of alerts to be deleted.
   * @param {string} polluant - The pollutant of the alerts to be deleted.
   */
  static supprimerNotification(date, polluant) {
    ModelAlerte.allInstances = ModelAlerte.allInstances.filter(
      (alerte) => alerte.date !== date || alerte.polluant !== polluant
    );
  }

  /**
   * Deletes all alert instances.
   */
  static supprimerToutAlerte() {
    ModelAlerte.allInstances = [];
  }

  /**
   * Gets the number of alerts that have not been read.
   * @param {string[]} pollant_NonLu - List of unread pollutants.
   * @returns {number} The number of alerts that have not been read.
   */
  static nombreDepassement(pollant_NonLu = []) {
    return ModelAlerte.allInstances.filter(
      (alerte) => !pollant_NonLu.includes(alerte.polluant)
    ).length;
  }

  /**
   * Gets the number of alerts for a specific pollutant.
   * @param {string} polluant - The pollutant.
   * @returns {number} The number of alerts for the specified pollutant.
   */
  static nombreDepassementElement(polluant) {
    const instancesFiltrees = ModelAlerte.allInstances.filter(
      (alerte) => alerte.polluant === polluant
    );
    return instancesFiltrees.length;
  }

  /**
   * Displays notifications of unread alerts.
   * @param {string[]} pollant_NonLu - List of unread pollutants.
   */
  static afficherNotification(pollant_NonLu = []) {
    const caseNotifications = document.getElementById("caseNotifications");
    caseNotifications.innerHTML = "";

    // Filtrer les alertes non lues
    const alertesAafficher = ModelAlerte.allInstances.filter(
      (alerte) => !pollant_NonLu.includes(alerte.polluant)
    );

    alertesAafficher.forEach((alerte) => {
      // Conteneur de l'alerte
      const alerteElement = document.createElement("div");
      alerteElement.classList.add(
        "notification",
        alerte.getPolluant().replace(/ /g, "")
      );

      // Création des sous-éléments
      const polluantEl = document.createElement("p");
      polluantEl.classList.add("polluant");
      polluantEl.textContent = alerte.polluant;

      const valeurEl = document.createElement("p");
      valeurEl.classList.add("valeur");
      valeurEl.textContent = `${(
        (alerte.valeur.slice(0, 6) / alerte.seuil) *
        100
      ).toFixed(2)}%`;

      const dateEl = document.createElement("p");
      dateEl.classList.add("date");
      dateEl.textContent = alerte.date;

      // Ajout dans le conteneur
      alerteElement.appendChild(polluantEl);
      alerteElement.appendChild(valeurEl);
      alerteElement.appendChild(dateEl);

      // Ajout dans la zone de notifications
      caseNotifications.appendChild(alerteElement);
    });
  }

  /**
   * Displays the counter for the number of unread alert overflows.
   * @param {string[]} Polluant_Non_LU - List of unread pollutants.
   */
  static afficherCompteur(Polluant_Non_LU = []) {
    const nombreDepassements = this.nombreDepassement(Polluant_Non_LU);
    const nombreDepassementElement =
      document.getElementById("nombre_TEXT_Alerte");
    nombreDepassementElement.textContent = nombreDepassements;
  }
}
