const XLSX = require('xlsx');

/**
 * Classe représentant un modèle pour traiter les fichiers XLSX.
 */
class ModelXLSX {
    /**
     * Gets XLSX file data from a link.
     * @returns {Promise<Array>} Data from the XLSX file.
     */
    async obtenirXlsx() {
        const link = "https://www.lcsqa.org/system/files/media/documents/Liste%20points%20de%20mesures%202021%20pour%20site%20LCSQA_27072022.xlsx";

        try {
            // Fetch the XLSX file
            const response = await fetch(link);
            if (!response.ok) {
                throw new Error('Échec de la récupération du fichier XLSX');
            }

            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[1]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                raw: false, // Keep cell values as strings
                defval: '', // Default value for empty cells
            });

            // Remove the first four rows
            const filteredData = jsonData.slice(4);

            return filteredData;
        } catch (error) {
            console.error('Erreur lors de l\'importation du fichier XLSX:', error);
            return null;
        }
    }

    /**
     * Counts the number of stations by filtering the specified regions.
     * @param {Array<string>} AASQA_Filtre - List of regions to filter (Not included in selection)
     * @returns {Promise<Object>} An object containing the number of stations.
     */
    async compterNombreStation(AASQA_Filtre = []) {
        try {
            // Get the XLSX file data
            const data = await this.obtenirXlsx();
            if (!data) return { "nombre station": 0 };

            const nombreDeStations = data.reduce((count, row) => {
                const region = row[3]; // La colonne 4
                return AASQA_Filtre.includes(region) ? count : count + 1;
            }, 0);

            return { "nombre station": nombreDeStations };
        } catch (error) {
            console.error('Erreur lors du comptage du nombre de stations:', error);
            return { "nombre station": 0 };
        }
    }
}

module.exports = ModelXLSX;
