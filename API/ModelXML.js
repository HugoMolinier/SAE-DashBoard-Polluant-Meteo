/* REQUIRE*/
const jsdom = require("jsdom");
const fs = require("fs");

const dataset_d = "https://www.data.gouv.fr/fr/datasets/r/5f112ee8-84fa-4ff7-901c-862a8c0c478b";
const dataset_b = "https://www.data.gouv.fr/fr/datasets/r/eeebe970-6e2b-47fc-b801-4a38d53fac0d";
const polluant = "http://dd.eionet.europa.eu/vocabulary/aq/pollutant/json";


class ModelXML {
    /**
     * Parse a XML file from a URL.
     * 
     * @param {string} url - The URL of the XML file.
     * @returns {Promise<Document>} The XML document.
     * @deprecated
     */
    async xmlParser(url) {
        try {
            // Fetch the XML file
            let res = await fetch(url);
            if (!res.ok) {
                throw new Error('Échec de la récupération du fichier XML');
            }
            let xml = (new (new jsdom.JSDOM("")).window.DOMParser()).parseFromString((await res.text()), "text/xml");
            return xml;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Extract data from XML files and JSON file.
     * 
     * @returns {Promise<string>} The JSON data.
     */
    async dataJson() {
        // Check if the file exists
        try {
            return fs.readFileSync('./API/stations.json', 'utf-8');
        } catch (error) { console.error("stations.json doesn't exist"); 

        // Parse the XML files and JSON file
        let data_d = await this.xmlParser(dataset_d);
        let data_b = await this.xmlParser(dataset_b);
        let json = await fetch(polluant);
        json = await json.json();
        let map = {};

        //Dataset B
        for (let b of data_b.documentElement.getElementsByTagName("gml:featureMember")) {
            try {
                // Get the key
                let key = b.getElementsByTagName("base2:organisationName").item(0).getElementsByTagName("gco:CharacterString").item(0).textContent;
                if (!(key in map)) {
                    map[key] = {};
                }
                // Get the zone
                let zon = b.getElementsByTagName("base:localId").item(0).textContent.split("_")[0];

                // Add the data to the map
                map[key][zon] = {}
                map[key][zon]["stations"] = {}
                map[key][zon]["City"] = b.getElementsByTagName("gn:text").item(0).textContent;
                map[key][zon]["Postcode"] = b.getElementsByTagName("ad:postCode").item(0).textContent;
                map[key][zon]["Locator"] = b.getElementsByTagName("ad:locatorDesignator").item(0).textContent;
                map[key][zon]["Polygon"] = {};
                for (let element of b.getElementsByTagName("gml:Polygon")) {
                    map[key][zon]["Polygon"][element.getAttribute("gml:id")] = element.getElementsByTagName("gml:posList").item(0).textContent;
                }
            } catch (error) {
                continue;
            }
        }

        //Datased D
        for (let d of data_d.documentElement.getElementsByTagName("gml:featureMember")) {
            try {
                // Get the key
                let key = d.getElementsByTagName("base2:organisationName").item(0).getElementsByTagName("gmd:LocalisedCharacterString").item(0).textContent;
                if (!(key in map)) {
                    map[key] = {};
                }
                // Get the other data
                let station = d.getElementsByTagName("base:localId").item(0).textContent.split("_")[0];
                let zon = d.getElementsByTagName("aqd:zone").item(0).getAttribute("xlink:href").split("/").pop();
                let idpolluant = d.getElementsByTagName("base:localId").item(0).textContent.split("_")[1];

                // If the station wasn't put, add it to the map
                if (!(station in map[key][zon]["stations"])) {
                    map[key][zon]["stations"][station] = {};
                    map[key][zon]["stations"][station]["City"] = d.getElementsByTagName("gn:text").item(0).textContent;
                    map[key][zon]["stations"][station]["Postcode"] = d.getElementsByTagName("ad:postCode").item(0).textContent;
                    map[key][zon]["stations"][station]["Locator"] = d.getElementsByTagName("ad:locatorDesignator").item(0).textContent;
                    map[key][zon]["stations"][station]["Lat"] = d.getElementsByTagName("gml:pos").item(0).textContent.split(" ")[0];
                    map[key][zon]["stations"][station]["Lon"] = d.getElementsByTagName("gml:pos").item(0).textContent.split(" ")[1];
                }
                
                // Add the data to the map
                map[key][zon]["stations"][station][idpolluant] = {};
                map[key][zon]["stations"][station][idpolluant]["Pollutant"] = json["concepts"][idpolluant]["Notation"];
                map[key][zon]["stations"][station][idpolluant]["TimePeriod"] = [];
                for (let element of d.getElementsByTagName("ef:observingTime")) {
                    let tempmap = {};
                    tempmap["Begin"] = element.getElementsByTagName("gml:beginPosition").item(0).textContent;
                    tempmap["End"] = element.getElementsByTagName("gml:endPosition").item(0).textContent;
                    map[key][zon]["stations"][station][idpolluant]["TimePeriod"].push(tempmap);
                }
            } catch (error) {
                continue;
            }
        }

        // Save the map to a JSON file
        map = JSON.stringify(map);
        try {
            fs.writeFile("./API/stations.json", map, function (error) {
                if (error) {
                    console.error(error);
                    return error;
                }
                console.log("The file was saved!");
            });
        } catch (error) {
            console.error(error);
        }
        return map;
    }
}}

module.exports = ModelXML;