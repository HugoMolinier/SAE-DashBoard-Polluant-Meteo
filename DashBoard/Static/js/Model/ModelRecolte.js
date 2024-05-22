/**
 * Gets the number of limit exceedances per pollutant. : 
*/
var O3Limite=120;
var COLimite=10;
window["NOX as NO2Limite"] =30;
var NO2Limite=40;
var C6H6Limite=5;
var NOLimite=100000; // No limit found
var SO2Limite=125;
var PM10Limite=50;
window["PM2.5Limite"] = 25;

/**
 * Class representing a data collection model.
 */
class ModelRecolte {
    /**
     * Retrieves the contents of the CSV file from the specified link.
     * @param {string} link - Link to CSV file.
     * @returns {Promise<Array<Array<string>>>} CSV data in the form of an array of strings.
     */
    async obtenirDataAPI(link) {
        try {
            // Fetch the data from the API
            const response = await fetch(link);
            if (!response.ok) {
                throw new Error('Échec de la récupération des data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur lors de l\'importation des data :', error);
        }
    }
  
    /** 
    * Graphic format
    *
    * @param {Array<Object>} data (data AVG Polluant)
    * @returns {Object} - Data formatted for the graph.
    * > [ [date1,date2,date3,...], 
    * ['nom_polluant',moyennepolluant1.1,moyennepolluant1.2,moyennepolluant1.3], 
    * ['nom_polluant2',moyennepolluant2.1,moyennepolluant2.2, moyennepolluant2.3]]
    */
    dataFormatGraphique(data) {
        var ensemble_date = Object.keys(data);
        ensemble_date.unshift("x"); // Add "x" as first value of ensemble_date
        var polluants = ["CO", "C6H6", "NO", "NO2", "O3", "NOX as NO2", "PM2.5", "PM10", "SO2"];
        var DataFormater = [ensemble_date];

        // Add the values of the polluants to the DataFormater array
        for (var i = 0; i < polluants.length; i++) {
            var polluant = polluants[i];
            var polluantArray = [polluant];
            for (var j = 1; j < ensemble_date.length; j++) {
                var date = ensemble_date[j];
                this.verifierSeuil(polluant,data[date][polluant],date)
                var value =  data[date][polluant] ?data[date][polluant] : polluantArray[polluantArray.length - 1];
                polluantArray.push(value);
            }
            DataFormater.push(polluantArray);
        }
        return DataFormater;
    }

    /**
     * Checks whether the value of a pollutant exceeds the threshold and generates an alert if necessary.
     * @param {string} Polluant - The name of the pollutant.
     * @param {number} valeur - The value of the pollutant.
     * @param {string} date - The date associated with the value.
     */
    verifierSeuil(Polluant,valeur,date){
        const limites = {
            "O3": O3Limite,
            "PM2.5": window["PM2.5Limite"],
            "PM10": PM10Limite,
            "NO2": NO2Limite,
            "SO2": SO2Limite,
            "NOX as NO2": window["NOX as NO2Limite"],
            "CO": COLimite,
            "C6H6": C6H6Limite,
            "NO": NOLimite
        };
    
        if (limites[Polluant] && valeur >= limites[Polluant]) {
            new ModelAlerte(Polluant, date, valeur, limites[Polluant]);
        }
    }
    
    /**
     * Data format for the entire selected date. Average for the day
     * And adds to the dictionary in { polluant1 : [somme_total, nombre_jour],... }
     * @param {Object} allDataMoyenne - Average data.
     * @param {Array<Array<string>>} dataOfTheDay - Data for the day.
     * @returns {Object} - Average data formatted for the graph.
     */
    formatMoyenne(allDataMoyenne,dataOfTheDay){
        // For average daily data
        for (let i = 1; i < dataOfTheDay.length; i++) {
            let row = dataOfTheDay[i];
            let polluant = row[0];
            let values=[];
            for (let j = 1; j < row.length; j++) {
                values.push(parseFloat(row[j]));
                this.verifierSeuil(polluant,row[j],dataOfTheDay[0][j]);
            } 
            let averageValue = values.reduce((acc, val) => acc + val, 0) / values.length/window[dataOfTheDay[i][0]+"Limite"]*100;

            // Add the average to our results table with the name of the pollutant
            if (polluant in allDataMoyenne) {
                allDataMoyenne[polluant][0] += parseFloat(averageValue.toFixed(2));
                allDataMoyenne[polluant][1]++;
            } else {
                allDataMoyenne[polluant] = [parseFloat(averageValue.toFixed(2)), 1];
            }
        }
        return allDataMoyenne;


    }

    /*
     * Transforme les données obtenue grace a FormatMoyenne en format graphique.
     * [[nom_polluant, moyenne],....]
     * @param {Object} allDataGraph - Les données de moyenne.
     * @returns {Array<Array<any>>} - Les données de moyenne formatées pour le graphique.
     */
    transformeMoyenneGraphique(allDataGraph){
        let tableau = [];
        for (let cle in allDataGraph) {
            tableau.push([cle, allDataGraph[cle][0]/allDataGraph[cle][1]]);
        }
        return tableau;
    }

    /**
     * Fusionne plusieurs tableaux en un seul en regroupant les valeurs par clé ( valeurs a l'index 0 de chaque array)
     * @param {Array<Array<any>>} arrays - Les tableaux à fusionner.
     * @returns {Array<Array<any>>} - Le tableau fusionné.
     */
    fusionnerDeuxArrays(AllArray,ArrayJour) {
        if (ArrayJour.length ===0)return AllArray;
        if (AllArray.length === 0) return ArrayJour;
        ArrayJour.forEach(element => {
            let exists = AllArray.some(arr => arr[0] === element[0]);
            if (!exists) {
                AllArray.push(element);
            } else {
                let index = AllArray.findIndex(arr => arr[0] === element[0]);
                AllArray[index] = AllArray[index].concat(element.slice(1));
            }
        });
        return AllArray;
    }
    
    afficherNombreValeur(nombre){
        const nombreDepassementElement = document.getElementById("nombre_TEXT_Valeur");
        nombreDepassementElement.textContent = nombre;  
    }
}