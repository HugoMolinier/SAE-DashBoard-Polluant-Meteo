// Get Static Stations Data
let stations = new XMLHttpRequest();
stations.open("GET", "http://localhost:8080/api/stations", true);
stations.onerror = function () {
    console.error("ERROR : Import station.json");
}
stations.onload = function () {
    const data = JSON.parse(stations.responseText);
    initDataMap(data);
    stationsFilters(data);

    const checkboxes = document.querySelectorAll('.checkbox-polluant input[type="checkbox"]');
    let Polluant_Non_LU = [];

    checkboxes.forEach(checkbox => { checkbox.addEventListener("change", gestionnaireChangementPolluants); });
}
stations.send();