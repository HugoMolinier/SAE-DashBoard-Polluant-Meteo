/*Require */
const ModelCSV = require('./ModelCSV');
const ModelXML = require('./ModelXML');
const ModelXLSX = require('./ModelXLSX');
const express = require('express');
const router = express.Router();
const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '1.0.0',
    title: 'SAE 4.A',
    license: {
      name: 'Ceci est la documentation de l\'API de la SAE 4.A',
    },
  },
  // Base directory which we use to locate your JSDOC files
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: './*.js',
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/v3/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};
expressJSDocSwagger(router)(options);

router.get('/', function(req, res){
    // redirect to the documentation
    res.redirect('/api/docs');
});

/**
 * GET /api/getDate
 * @summary Obtenir les données en fonction de la date
 * @tags API
 * @param {string} date.query.required - Date à laquelle les données doivent être récupérées sous cette forme `(YYYY-MM-DD)`. Année minimum : 2021
 * @param {string} count.query - Nombre de données à récupérer (par défaut `10`, `-1` pour tout récupérer)
 * @return {object} 200 - Succès de la requête (réponse) - application/json
 * @example response - 200 - Exemple de réponse
 * {
 *   "Date de début": "2023/01/01 00:00:00",
 *   "Date de fin": "2023/01/01 01:00:00",
 *   "Organisme": "ATMO GRAND EST",
 *   "code zas": "FR44ZAG02",
 *   "Zas": "ZAG METZ",
 *   "code site": "FR01011",
 *   "nom site": "Metz-Centre",
 *   "type d'implantation": "Urbaine",
 *   "Polluant": "NO",
 *   "type d'influence": "Fond",
 *   "discriminant": "A",
 *   "Réglementaire": "Oui",
 *   "type d'évaluation": "mesures fixes",
 *   "procédure de mesure": "Auto NO Conf meth CHIMILU",
 *   "type de valeur": "moyenne horaire validée",
 *   "valeur": "0.7",
 *   "valeur brute": "0.725",
 *   "unité de mesure": "µg-m3",
 *   "taux de saisie": "",
 *   "couverture temporelle": "",
 *   "couverture de données": "",
 *   "code qualité": "A",
 *   "validité": "1"
 * }
 */
router.get('/getDate', async function(req, res) {
    try {
        let count = 10;
        if (req.query.count) {
            count = parseInt(req.query.count);
        }

        let csv = new ModelCSV();
        let resp = JSON.stringify(csv.clean(await csv.obtenirCsv(req.query.date, count)));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(resp);
    } catch (error) {
        console.error('Erreur lors de la récupération et de la conversion des données CSV:', error);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Erreur lors de la récupération des données CSV' }));
    }
});

/**
 * GET /api/getAVG
 * @summary Obtenir les moyennes des polluants en fonction de la date
 * @tags API
 * @param {string} date.query.required - Date à laquelle les données doivent être récupérées sous cette forme `(YYYY-MM-DD)`
 * @param {string} count.query - Nombre de données à récupérer (par défaut `100`, `-1` pour tout récupérer)
 * @return {object} 200 - Succès de la requête (réponse) - application/json
 */
router.get('/getAVG', async function(req, res){
    try {
        let csv = new ModelCSV();
        let timescale = "hour";

        let count = 100;
        if (typeof req.query.count !== 'undefined') {
            count = parseInt(req.query.count);
        }

        let resp = JSON.stringify(csv.avgPolluantByDate(csv.clean(await csv.obtenirCsv(req.query.date, count)), timescale));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(resp);
    } catch (error) {
        console.error('Erreur lors de la récupération et de la conversion des données CSV:', error);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Erreur lors de la récupération des données CSV' }));
    }
});

/**
 * GET /api/GetFormatGraph
 * @summary Obtenir les données formatées pour un graphique
 * @tags API
 * @param {string} date.query.required - Date à laquelle les données doivent être récupérées sous cette forme `(YYYY-MM-DD)`
 * @param {string} AASQA.query - Code de l'AASQA (Agence de l'Air et de la Qualité de l'Air) à laquelle les données doivent être récupérées (par défaut `[]`)
 * @param {string} count.query - Nombre de données à récupérer (par défaut `100`, `-1` pour tout récupérer)
 * @return {object} 200 - Succès de la requête (réponse) - application/json
 */
router.get('/GetFormatGraph', async function(req, res){
    try{
        let csv = new ModelCSV();
        let resp = null;
        let timescale = "hour";

        let count = 100;
        if (typeof req.query.count !== 'undefined') {
            count = parseInt(req.query.count);
        }
        
        resp = JSON.stringify(csv.directDataGraph(await csv.obtenirCsv(req.query.date, count),req.query.AASQA), timescale);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(resp);
    } catch (error) {
        console.error('Erreur lors de la récupération et de la conversion des données CSV:', error);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Erreur lors de la récupération des données CSV' }));
    }

});

/**
 * GET /api/stations
 * @summary Obtenir les stations
 * @tags API
 * @return {object} 200 - Succès de la requête (réponse) - application/json
 * @example response - 200 - Exemple de réponse
 * {
 *   "GWAD'AIR": {
 *     "ZON-FR01ZAG01": {
 *       "stations": {
 *         "SPO-FR37001": {
 *           "5": {
 *             "Pollutant": "Ni in PM2.5",
 *             "TimePeriod": [
 *               {
 *                 "Begin": "2014-10-31T00:00:01+01:00",
 *                 "End": ""
 *               }
 *             ]
 *           },
 *           "City": "PETIT BOURG",
 *           "Postcode": "97170",
 *           "Locator": "9 Lotissement VINCE - ARNOUVILLE",
 *           "Lat": "16.257307",
 *           "Lon": "-61.591724"
 *         }
 *       }
 *     }
 *   }
 * }
 */
router.get('/stations', async function(req, res){
    try{
        let xml = new ModelXML();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(await xml.dataJson());
    } catch (error) {
        console.error('Erreur lors de la récupération et de la conversion des données XML:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Erreur lors de la récupération des données XML' }));
    }
});

/**
 * GET /api/getrawDate
 * @summary Obtenir les données en version brute
 * @tags Obsolète
 * @deprecated
 * @param {string} date.query.required - Date à laquelle les données doivent être récupérées sous cette forme `(YYYY-MM-DD)`. Année minimun : 2021
 * @param {string} count.query - Nombre de données à récupérer (par défaut `10`, `-1` pour tout récupérer)
 * @return {object} 200 - Succès de la requête (réponse) - application/json
 * @example response - 200 - Exemple de réponse
 * {
 *   "Date de début": "2023/01/01 01:00:00",
 *   "Date de fin": "2023/01/01 02:00:00",
 *   "Organisme": "ATMO GRAND EST",
 *   "code zas": "FR44ZAG02",
 *   "Zas": "ZAG METZ",
 *   "code site": "FR01011",
 *   "nom site": "Metz-Centre",
 *   "type d'implantation": "Urbaine",
 *   "Polluant": "PM10",
 *   "type d'influence": "Fond",
 *   "discriminant": "C",
 *   "Réglementaire": "Oui",
 *   "type d'évaluation": "mesures fixes",
 *   "procédure de mesure": "Auto PM_Conf_app TEOM 1405-F",
 *   "type de valeur": "moyenne horaire validée",
 *   "valeur": "2",
 *   "valeur brute": "1.95",
 *   "unité de mesure": "µg-m3",
 *   "taux de saisie": "",
 *   "couverture temporelle": "",
 *   "couverture de données": "",
 *   "code qualité": "A",
 *   "validité": "1"
 * }
 */
router.get('/getrawDate', async function(req, res) {
    try {
        let count = 10;
        if (req.query.count) {
            count = parseInt(req.query.count);
        }
        
        let csv = new ModelCSV();
        res.writeHead(200, {'Content-Type': 'application/json'});
        let resp = JSON.stringify(await csv.obtenirCsv(req.query.date, count));
        res.end(resp);
    } catch (error) {
        console.error('Erreur lors de la récupération et de la conversion des données CSV:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Erreur lors de la récupération des données CSV' }));
    }
});

//TEST
router.get('/searchv2test', async function(req, res) {
    try {
        let csv = new ModelCSV();
        const data = await csv.obtenirMultiCsv(req.query.datedebut, req.query.datefin);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    } catch (error) {
        console.error('Erreur lors de la récupération et de la conversion des données CSV:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Erreur lors de la récupération des données CSV' }));
    }
});

/**
 * GET /api/stationsRaw
 * @summary Obtenir les stations en version brute
 * @tags API
 * @return {object} 200 - Succès de la requête (réponse) - application/json
 * @example response - 200 - Exemple de réponse
 * [
 *   [
 *     "FR01011",
 *     "Metz-Centre",
 *     "urbaine",
 *     "ATMO GRAND EST",
 *     "FR44ZAG02",
 *     "ZAG METZ",
 *     "ZAG",
 *     "GRAND EST",
 *     "57463",
 *     " METZ ",
 *     "116581",
 *     " METZ ",
 *     "285930",
 *     "agglomération",
 *     "49.119442",
 *     "6.180833",
 *     "fond",
 *     "fond",
 *     "fond",
 *     "",
 *     "fond",
 *     "",
 *     "",
 *     "",
 *     "",
 *     "",
 *     "",
 *     "",
 *     "mesures fixes",
 *     "mesures fixes",
 *     "mesures fixes",
 *     "",
 *     "mesures fixes",
 *     "",
 *     "",
 *     "",
 *     "",
 *     "",
 *     "",
 *     ""
 *   ]
 * ]
 */
router.get('/stationsRaw', async function(req, res) {
    try {
        let XLSX = new ModelXLSX();
        const data = await XLSX.obtenirXlsx(req.query.page);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    } catch (error) {
        console.error('Erreur lors de la récupération et de la conversion des données CSV:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Erreur lors de la récupération des données CSV' }));
    }
});

/**
 * GET /api/NombreStation
 * @summary Obtenir le nombre de stations
 * @tags API
 * @param {string} AASQA.query - Code de l'AASQA (Agence de l'Air et de la Qualité de l'Air) à laquelle les données doivent être récupérées (par défaut `[]`)
 * @return {object} 200 - Succès de la requête (réponse) - application/json
 */
router.get('/NombreStation', async function(req, res) {
    try {
        let XLSX = new ModelXLSX();
        const data = await XLSX.compterNombreStation(req.query.AASQA);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    } catch (error) {
        console.error('Erreur lors de la récupération et de la conversion des données CSV:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Erreur lors de la récupération des données CSV' }));
    }
});

module.exports = router;
