/**
 * Class representing a weather model for weather data management.
 */
class ModelMeteo {
    /**
     * Constructor of the ModelMeteo class.
    */
    constructor(region_choisis,date){
        this.region_choisis=region_choisis;
        this.date = date;
        this.data_jour="";
    }
    
    /**
     * Get weather data for a specified day, or the previous day if no date is given.
     * @async
     * @param {Date} [date=new Date()] - The date for which to obtain weather data. By default, the current date.
     * @returns {Promise<Object>} Weather data retrieved from today's API, and if empty returns the day before.
     */
    async obtenirMeteoJour(){
        // Get weather data from the API
        const instanceRecolteMétéo = new ModelRecolte();
        let dataMétéo = await instanceRecolteMétéo.obtenirDataAPI("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/donnees-synop-essentielles-omm/records?select=date%2C%20dd%2Ctc%2Cu%2Ctemps_passe_1%2Ctemps_present%2Ctc%2Cnom_reg&&where=date%20%3D%20date'"+this.date+ "'&limit=100");
        if (dataMétéo["total_count"] === 0) {
            dataMétéo = await instanceRecolteMétéo.obtenirDataAPI("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/donnees-synop-essentielles-omm/records?select=date%2Cdd%2Ctc%2Cu%2Ctemps_passe_1%2Ctemps_present%2Cnom_reg%2Cnom_epci&&where=date%20%3D%20date'"+ this.getJourPrecedent() + "'&limit=100");
            this.date = this.getJourPrecedent();
        }
        this.data_jour=dataMétéo['results'];
        this.supprimerDoublonsParPropriete();
        this.choisirMeteo();
        
    }

    /**
     * Displays weather data for the selected region.
     */
    choisirMeteo() {
        if (this.data_jour) {
            // Browse results
            this.data_jour.forEach(function(region) {
                if (region["nom_reg"] == this.region_choisis) {
                    this.afficherRegion(region);
                    return; // If you have found the region, you can exit the function
                }
            }, this);
        }
    }

    /**
     * Displays weather data for the region.
     * @param {Object} data - Weather data for the region.
     */
    afficherRegion(data) {
        // Display weather data
        document.getElementById("texte_Region").textContent =  data.nom_reg || "NaN";;        
        document.getElementById("temperature").textContent =  this.formatTemperature(data.tc)+'°C' ||'NaN';
        document.getElementById("Date_météo_vent").textContent =  this.date;
        var image_temps = document.getElementById("image_temps");
        const imageSrc = (data && data.temps_passe_1 && (data.temps_passe_1.includes("Nuages") ? "nuage.png" : (data.temps_passe_1.includes("Pluie") ? "pluie.png" : "soleil.png"))) || "soleil.png";
        image_temps.src = `./dashboard/img/logo_temps/${imageSrc}`;
    }

    /**
     * Displays the temperature and weather for the selected region in a PDF.
     * @returns {Array} - The temperature and weather for the selected region.
     */
    infoPdf() {
        for (let region of this.data_jour) {
            if (region.nom_reg === this.region_choisis) {
                return [this.formatTemperature(region.tc), region.temps_passe_1];
            }
        }
        return null;
    }

    /**
     * Updates iframe with new coordinates.
     * @param {number} latitude - The latitude.
     * @param {number} longitude - The longitude.
     */
    mettreAJourIFrame( latitude=48.7784448, longitude=2.441216) {
        // Build the new URL by replacing the date and coordinates
        const iframe = document.getElementById('inlineFrameExample');
        let dateFormatee = this.date.replace(/-/g, '/');
        var nouvelleURL = "https://earth.nullschool.net/fr/#" + dateFormatee + "/0300Z/wind/surface/level/grid=off/orthographic=" + longitude + "," + latitude + ",600";
        iframe.src = nouvelleURL;
    }
    
    /**
    * Get the previous day's date, taking into account months and leap years.
    * @returns {string} The previous day's date in the format YYYY-MM-DD.
    */
    getJourPrecedent() {
        const date = new Date(this.date);
        date.setDate(date.getDate() - 1);
        return date.toISOString().slice(0, 10);
    }
    
    /**
     * Gets the next day's date.
     * @returns {string} The next day's date in the format YYYY-MM-DD.
     */
    getJourSuivant() {
        const date = new Date(this.date);
        date.setDate(date.getDate() + 1);
        return date.toISOString().slice(0, 10);
    }

    /**
     * Sets the previous day's date.
     */
    setJourPrecedent(){
        this.date= this.getJourPrecedent()
    }

    /**
     * Sets the next day's date if it does not exceed the current date.
     */
    setJourSuivant(){
        if (this.verifierDepassementJour()){
          this.date= this.getJourSuivant()
        }
    }

    /**
     * Gets the date.
     * @returns {Date} The date.
     */
    getDate(){
        return this.date;
    }

    /**
     * Sets the date.
     * @param {Date} date - The date to be set.
     */
    setDate(date){
        this.date=date
    }

    /**
     * Formats the temperature to two decimal places.
     * @param {number} temperature - The temperature to be formatted.
     * @returns {string} The formatted temperature.
    */
    formatTemperature(temperature){
        return temperature.toString().slice(0, 4);

    }

    /**
     * Checks that the next date does not exceed the current date.
     * @returns {boolean} True if the next date does not exceed the current date, otherwise False.
     */
    verifierDepassementJour() {
        var dateActuelle = new Date();
        if (new Date(this.getJourSuivant()).getTime() >= dateActuelle.getTime()) {
            return false;
        }
        return true;
    }

    /**
     * Displays the next region.
    */
    suivantRegion() {
        const index_reg = (this.trouverIndexRegion() + 1) % this.data_jour.length;
        this.afficherRegion(this.data_jour[index_reg]);
        this.setRegion(this.data_jour[index_reg]['nom_reg']);
    }

    /**
     * Displays the previous region.
    */
    precedentRegion() {
        const index_reg = (this.trouverIndexRegion() - 1 + this.data_jour.length) % this.data_jour.length;
        this.afficherRegion(this.data_jour[index_reg]);
        this.setRegion(this.data_jour[index_reg]['nom_reg']);
    }

    /**
     * Sets the selected region.
    */
    setRegion(region){
        this.region_choisis=region;
    }

    /**
     * Finds the index of the selected region.
     * @returns {number} The index of the selected region.
    */
    trouverIndexRegion() {
        return this.data_jour.findIndex(element => element['nom_reg'] === this.region_choisis);
    }
    
    /**
     * Removes duplicates from the data by property.
    */
    supprimerDoublonsParPropriete() {
        const valeursUniques = new Set();

        // Filter the data to keep only unique values
        const objetsUniques = this.data_jour.filter(objet => {
            const nomReg = objet['nom_reg'];
            if (nomReg !== undefined && nomReg !== null && !valeursUniques.has(nomReg)) {
                valeursUniques.add(nomReg);
                return true; // Adds the object to the table of unique objects
            }
            return false; // Filters out objects with `undefined` or `null` values
        });
        this.data_jour = objetsUniques;
    }
}