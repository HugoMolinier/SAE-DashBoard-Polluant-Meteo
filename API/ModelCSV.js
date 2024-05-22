class ModelCSV {
    /**
     * Take a string and return array
     * return :
     * > [{colum1 : "value1", colum2 : "value2"}{colum1 : "value3", colum2 : "value4"}]
     * @param {String} csv 
     * @param {String} separotor 
     * @param {String} delimiter 
     * @returns {Array<Object>}
     */
    csvToJson(csv, separotor = ";", delimiter = "\n") {
        try {
            // Take a column name
            const head = csv.slice(0, csv.indexOf(delimiter)).split(separotor);
            // Take rows
            const rows = csv.slice(csv.indexOf("\n") + 1).split("\n");

            return rows.map(function (row) {
                row = row.split(separotor);
                let columns = {}
                for (let element in row) {
                    columns[head[element]] = row[element];
                }
                return columns;
            });

        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Give the day's data of LCSQA
     * 
     * @param {String} date Format yyyy-mm-dd, Year cannot be less than 2021 (yyyy > 2020)
     * @param {Number} count Number of mesure desired
     * @filtre_AASQA {Array} Filter of AASQA that we don't want to see
     * @returns Array in JSON format
     */
    async obtenirCsv(date, count = -1) {
        try {
            // Check if String format is yyyy-mm-dd and yyyy > 2020
            if (!/^[2-9]\d[2-9][1-9]\-(0\d|1[0-2])\-(3[01]|[0-2]\d)$/.test(date)) {
                throw new Error("Invalid date format")
            }
            // Create the link
            var link = "https://files.data.gouv.fr/lcsqa/concentrations-de-polluants-atmospheriques-reglementes/temps-reel/" + date.substring(0, 4) + "/FR_E2_" + date + ".csv";
            const response = await fetch(link);
            if (!response.ok) {
                throw new Error('Échec de la récupération du fichier CSV');
            }
            let data = await response.text();

            data = this.csvToJson(data);

            // Handle count of data to return
            data = data.slice(0, count);

            return data;

        } catch (error) {
            console.error('Erreur lors de l\'importation du fichier CSV:', error);
        }
    }

    /**
     * Give the data of LCSQA between two dates
     * 
     * @param {*} date_début Format yyyy-mm-dd, Year cannot be less than 2021 (yyyy > 2020)
     * @param {*} date_fin Format yyyy-mm-dd, Year cannot be less than 2021 (yyyy > 2020)
     * @returns Array in JSON format
     */
    async obtenirMultiCsv(date_début, date_fin) {
        try {
            var data = [];
            for (var day = new Date(date_début); day.getTime() <= new Date(date_fin).getTime(); day.setDate(day.getDate() + 1)) {
                // Break if the day is greater than today
                var date = new Date();
                if (day.getTime() > date.getTime()) {
                    break;
                }

                // Get the data
                var formattedDate = this.getFormattedDate(day);
                var dataget = await this.obtenirCsv(formattedDate);
                var csvData = this.clean(dataget);
                for (let i of csvData) {
                    data.push(i);
                }
            }

            return data;
        } catch (error) {
            console.error('Erreur lors de l\'importation des Multi fichier CSV:', error);
        }
    }

    /**
     * Take a date and return it in string format yyyy-mm-dd
     * 
     * @param {Date} timestamp 
     * @returns String format yyyy-mm-dd
     */
    getFormattedDate(timestamp) {
        let date = new Date(timestamp);
        let year = date.getFullYear();
        let month = ('0' + (date.getMonth() + 1)).slice(-2); // The month is 0-indexed, so we add 1
        let day = ('0' + date.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
    }

    /**
     * Select valid measure and not empty value
     * 
     * @param {Array<Object>} data 
     * @returns Array<Object>
     */
    clean(data) {
        data = data.filter(element => element.validité !== "-1");
    
        return data;
    }

    /**
     * Format data to a json object with the following format
     * > {date1: {Polluant1 : avg, Polluant2 : avg },
     * date2: {Polluant1 : avg, Polluant2: avg}
     * }
     * @param {Array<Object>} data 
     * @return Object
     */
    avgPolluantByDate(data, timescale = "hour") {
        try {
            let map = {};
            // Get the data and put it in the map
            for (let entry of Object.values(data)) {
                let value = parseFloat(entry["valeur brute"]);
                let key = entry["Date de début"];
            
                // Check for the timescale
                switch (timescale) {
                    case "day":
                        key = key.substring(0, 10);
                        break;
                    case "month":
                        key = key.substring(0, 7);
                        break;
                    case "year":
                        break;
                    default:
                        // hour
                        key = key;
                        break;
                }

                // if the key is not in the map, we create it
                if (!(key in map)) {
                    map[key] = {};
                }
            
                // if the polluant is not in the map, we create it
                if (!(entry["Polluant"] in map[key])) {
                    map[key][entry["Polluant"]] = [];
                }
            
                map[key][entry["Polluant"]].push(value);
            }
        
            // Calculate the average of the polluant
            for (let val of Object.keys(map)) {
                for (let polluant in map[val]){
                    map[val][polluant] = map[val][polluant].reduce(function (pvalue, cvalue ) {
                        return pvalue + cvalue;
                    }, 0) / map[val][polluant].length;
                }
            }
            return map;
          } catch (error) {
            console.error(error);
          }
    }

    /** 
    * Too slow to use
    * Format for the graph
    * > [ [date1,date2,date3,...], 
    * ['nom_polluant',moyennepolluant1.1,moyennepolluant1.2,moyennepolluant1.3], 
    * ['nom_polluant2',moyennepolluant2.1,moyennepolluant2.2, moyennepolluant2.3]
    * ]
    * @param {Array<Object>} data (data AVG Polluant)
    * @return Object
    */
    directDataGraph(data,AASQA_Filtre=[]) {
        try {
            let map = {};

            // We go through the data and we take the valid data and clean all double data
            for (const entry of data) {
                const value = parseFloat(entry["valeur brute"]);
                const organisationName = entry["Organisme"];
                const validité = entry["validité"];

                if (!(isNaN(value)) && (validité!="-1") && (!AASQA_Filtre.includes(organisationName))){
                    let dateKey = entry["Date de début"];
    
                    // if the date is not in the map, we create it
                    if (!(dateKey in map)) {
                        map[dateKey] = {};
                    }
    
                    // if the polluant is not in the map, we create it
                    if (!(entry["Polluant"] in map[dateKey])) {
                        map[dateKey][entry["Polluant"]] = [];
                    }

                    map[dateKey][entry["Polluant"]].push(value);
                }
            }
            let outputArray = [];
    
            // Array Date
            outputArray.push(["x", ...Object.keys(map)]);
            for (let polluant of Object.keys(map[Object.keys(map)[0]])) {
                let polluantArray = [polluant];
    
                // Browse dates and calculate the average for each pollutant
                for (let date of Object.keys(map)) {
                    if (map[date][polluant]) {
                        let values = map[date][polluant].filter(val => !isNaN(val));
                        if (values.length > 0) {
                            let avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
                            polluantArray.push(avgValue.toFixed(5));
                        } else {
                            polluantArray.push(polluantArray[-1]); 
                        }
                    }
                }
                outputArray.push(polluantArray);
            }
    
            return outputArray;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

module.exports = ModelCSV;