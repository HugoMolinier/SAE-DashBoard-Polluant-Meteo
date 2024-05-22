/**
 * Class representing a template for PDF generation.
 */
class ModelPDF {
    /**
     * Creates an instance of ModelPDF.
     * @param {instanceMeteo} instanceMeteo - Instance of the weather model.
     * @param {Array} Polluant_Non_LU - Array of pollutants not read.
     */
    constructor(instanceMeteo,Polluant_Non_LU) {
        this.instanceMeteo = instanceMeteo;
        this.Polluant_Non_LU = Polluant_Non_LU;
        this.doc = new jsPDF();
    }

    /**
     * Generates a PDF document.
     * @async
     */
    async generatePDF() {
        var new_y= this.informationPresentation(20,25)
        this.informationMeteo(new_y+5,25);

        this.doc.addPage();
        new_y=20;

        await this.informationGraph(new_y,25);
        this.doc.addPage();
        this.informationAlerte(new_y,25);
        // Save PDF document
        this.doc.save("output.pdf");
    }

    /**
     * Displays presentation information.
     * @param {number} position_y - Position in Y.
     * @param {number} position_x_départ - Starting X position.
     * @returns {number} The new Y position.
     */
    informationPresentation(position_y,position_x_départ) {
        this.doc.setFontSize(20);
        this.doc.setFont("Helvetica");
        this.doc.setTextColor(15, 71, 97);
        this.doc.text("Information du: " + document.getElementById('date').innerText, 30, position_y );
        this.doc.line(20, position_y +3, 190, position_y + 3); // Les coordonnées x et y définissent le début et la fin de la ligne

        this.doc.setFontSize(16);
        this.doc.setFontStyle('bold');
        this.doc.text("Cas d'étude:", position_x_départ, position_y + 20);
        this.doc.setFontStyle('normal');
        this.doc.text("Informations :", position_x_départ+15, position_y + 30);
        this.doc.setFontSize(12);
        this.doc.setTextColor(0, 0, 0);
        this.afficherInfo(position_y+40,position_x_départ+30)

        this.doc.setFontSize(16);
        this.doc.setTextColor(15, 71, 97);
        this.doc.text("Region Choisis :", position_x_départ+15, position_y + 70);
        this.doc.setFontSize(12);
        this.doc.setTextColor(0, 0, 0);
        return this.afficherRegion(position_y+80,position_x_départ+30);
    }
    
    /**
     * Displays 3-line information
     * @param {number} y - Y position.
     * @param {number} x - Starting X position.
     */
    afficherInfo(y, x) {
        let xPolluant = x;
        const polluants = ['CO', 'C6H6', 'NO', 'NO2', 'O3', 'NOX as NO2', 'PM2.5', 'PM10', 'SO2'];
        
        // Add "Pollutant: " before the first element
        this.doc.text('Polluant : ', xPolluant, y);
        xPolluant += this.doc.getTextWidth('Polluant : '); // Add text width "Pollutant: " for horizontal offset
    
        for (let i = 0; i < polluants.length; i++) {
            const polluant = polluants[i];
            if (!this.Polluant_Non_LU.includes(polluant)) {
                const largeurPolluant = this.doc.getTextWidth(polluant); // Pollutant width measurement
                if (i > 0) {
                    this.doc.text(',', xPolluant, y); // Comma display
                    xPolluant += this.doc.getTextWidth(', '); // Add comma width to horizontal offset
                }
                this.doc.text(polluant, xPolluant, y);
                xPolluant += largeurPolluant; // Horizontal offset for next pollutant
            }
        }
        this.doc.text("Nombre de station de la séléction: "+ document.getElementById('nombre_TEXT_station').innerHTML, x, y+7);
        this.doc.text("Valeur par polluant : "+ document.getElementById('nombre_TEXT_Valeur').innerHTML, x, y+14);
    }
    
    /**
     * Displays information on selected regions
     * @param {number} y - Y position.
     * @param {number} x - Starting X position.
     */
    afficherRegion(y, x) {
        let y_region = y;
        const labels = document.querySelectorAll('#filteraasq div label');
        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];
            if (label) { // Checks if label is not null
                const region = label.innerText;
                this.doc.text(region, x, y_region);
                y_region += 7;
            }
        }
        return y_region;
    }
    
    /**
     * Displays weather information.
     * @param {number} position_y - Position in Y.
     * @param {number} position_x_départ - Starting X position.
     */
    informationMeteo(position_y,position_x_départ){
        this.doc.setFontSize(16);
        this.doc.setTextColor(15, 71, 97);
        this.doc.setFontStyle('bold');
        this.doc.text("Météo du :" +this.instanceMeteo.date, position_x_départ, position_y+10);
        this.doc.setFontStyle('normal');
        this.doc.setFontSize(12);
        this.doc.setTextColor(0, 0, 0);
    
        this.doc.text("Region: " + this.instanceMeteo.region_choisis, position_x_départ+15,position_y+17);
        this.doc.text("Date: " + this.instanceMeteo.date, position_x_départ+15,position_y+24);
        const information = this.instanceMeteo.infoPdf()
        this.doc.text("Température : " +information[0]+"°C",position_x_départ+15,position_y+31);
        this.doc.text("Temps : " +information[1],position_x_départ+15,position_y+38);
    }

    /**
     * Displays graphics.
     * @async
     * @param {number} position_y - Position in Y.
     * @param {number} position_x_départ - Starting X position.
     */
    async informationGraph(position_y,position_x_départ) {
        this.doc.setFontSize(16);
        this.doc.setTextColor(15, 71, 97);
        this.doc.setFontStyle('bold');
        this.doc.text("Graphiques :", position_x_départ, position_y);
        this.doc.setFontStyle('normal');
        this.doc.setFontSize(12);
        this.doc.setTextColor(0, 0, 0);
        this.doc.text("Graphique de l’évolution des polluants de "+ document.getElementById('date').innerText, position_x_départ, position_y + 7);

        const imageUrl =  await this.screenshot('contener_courbes');
        this.doc.addImage(imageUrl, "PNG", position_x_départ-3, position_y+10 , 170, 115);

        this.doc.text("Graphique de la moyenne de dépassement des polluants de "+ document.getElementById('date').innerText, position_x_départ, position_y + 150);

        const imageUrl2 =  await this.screenshot('essuis1');
        this.doc.addImage(imageUrl2, "PNG", position_x_départ, position_y+155 , 80, 60);
        const imageUrl3 =  await this.screenshot('essuis2');
        this.doc.addImage(imageUrl3, "PNG", position_x_départ+100, position_y+155 , 80, 60);
    }

    /**
     * Displays overrun alerts.
     * @param {number} position_y - Position in Y.
     * @param {number} position_x_départ - Starting X position.
     */
    informationAlerte(position_y,position_x_départ) {
        this.doc.setFontSize(16);
        this.doc.setTextColor(15, 71, 97);
        this.doc.setFontStyle('bold');
        this.doc.text("Seuil de Dépassement :", position_x_départ, position_y);
        this.doc.setFontStyle('normal');
        this.doc.setFontSize(12);
        this.doc.setTextColor(0, 0, 0);
        this.doc.text("Rappelle des seuils de dépassements :", position_x_départ, position_y + 7);

        var columns = [{ title: "Polluants", dataKey: "polluants" },{ title: "Limite", dataKey: "limite" }];
    
        // Data for the table
        var dataPolluant = [
            { polluants: "O3", limite: 120 },{ polluants: "CO", limite: 10 },
            { polluants: "NOX as NO2", limite: 30 },{ polluants: "NO2", limite: 40 },
            { polluants: "C6H6", limite: 5 },{ polluants: "SO2", limite: 125 },
            { polluants: "PM2.5", limite: 25 },{ polluants: "PM10", limite: 50 },
            { polluants: "NO", limite: "NAN" }
        ];

        this.doc.autoTable({
            columns: columns, // Table columns
            body: dataPolluant, // Table body
            startY: position_y +10, // Vertical position of table start
            margin: { left: position_x_départ,right: position_x_départ }
        });    

        const data = ModelAlerte.getAllInstances();
        const processedPollutants = new Set(); // Together to track pollutants already treated

        let yPlus=80;
        for (const instance of data) {
            const polluant = instance.polluant;
            // Check whether the pollutant has already been treated
            if (!processedPollutants.has(polluant)) {
                const nombre_dep = ModelAlerte.nombreDepassementElement(polluant);
                if (nombre_dep !=0){
                    this.doc.text(`Nombre de dépassement Polluant ${polluant}  : ${nombre_dep} `, position_x_départ, position_y+20 + yPlus);
                    yPlus+=7
                }
                processedPollutants.add(polluant);
            }
        }

        this.doc.addPage();
        this.doc.setFontSize(16);
        this.doc.setTextColor(15, 71, 97);
        this.doc.setFontStyle('bold');
        this.doc.text("Alerte de dépassement en moyenne recenser :", position_x_départ, 30);
    
        // Defining table columns
        columns = [
            { header: 'Polluant', dataKey: 'polluant' },
            { header: 'Date', dataKey: 'date' },
            { header: 'Limite', dataKey: 'seuil' },
            { header: 'Valeur', dataKey: 'valeur' }
        ];
    
        // Generate table in PDF document
        this.doc.autoTable({
            columns: columns, // Table columns
            body: data, // Table body
            startY: 40, // Vertical position of table start
            margin: { left: position_x_départ,right: position_x_départ }
        });  
    }

    /**
     * Takes a screenshot.
     * @async
     * @param {string} id_div - Division ID.
     * @returns {string} Image URL in PNG format.
     */
    async screenshot(id_div) {
        const screenshotTarget = document.getElementById(id_div);
        const canvas = await html2canvas(screenshotTarget);
        return canvas.toDataURL("image/png");
    }

    /**
     * Gets the number of limit exceedances per pollutant.
     * @param {string} NomPolluant - Pollutant name.
     * @returns {number} The number of limit exceedances per pollutant.
     */
    nombreLimiteParPolluant(NomPolluant) {
        const allInstances = ModelAlerte.getAllInstances();
        const instancesForPollutant = allInstances.filter(instance => instance.polluant === NomPolluant);
        return instancesForPollutant.length;
    }
}
