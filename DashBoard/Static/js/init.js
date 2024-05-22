
let start_date=getFormattedDate(new Date());
let endDate=start_date;
fetchDataAndGenerateChart(start_date, endDate, AASQA_ENlever.slice());
document.getElementById("date").innerHTML = "<p>" + start_date + "</p>";

instanceMeteo = new ModelMeteo("Île-de-France", start_date);
instanceMeteo.obtenirMeteoJour();
instanceMeteo.mettreAJourIFrame(48.7784448, 2.441216);
const calendar = new Calendrier(instanceMeteo);


window.addEventListener("resize", function() {
  for (let i = 0; i < 7; i++) {
    setTimeout(() => {
      GraphBaton.majResize();GraphCercle1.majResize();GraphCercle2.majResize();
  }, 550);
  }
});


//===============================
// Ajout d'écouteurs d'événement
//===============================

document.getElementById("Recherche_Range").addEventListener("click",function(){
  start_date = document.getElementById("date_Debut").value;
  endDate = document.getElementById("date_Fin").value;
  fetchDataAndGenerateChart(start_date,endDate, AASQA_ENlever.slice());
  document.getElementById("date").innerHTML = "De " + start_date + " à " + endDate ;
  instanceMeteo.setDate(endDate);
  instanceMeteo.obtenirMeteoJour();
  instanceMeteo.mettreAJourIFrame();

});

document.getElementById("Bouton_pdf").addEventListener("click",function(){
  const pdfGenerator = new ModelPDF(instanceMeteo,Polluant_Non_LU);
  pdfGenerator.generatePDF();
});


document.getElementById("bouton_precedent_region").addEventListener("click", function() {
  instanceMeteo.Précédent_region();

});
document.getElementById("bouton_suivant_region").addEventListener("click", function () {
  instanceMeteo.Suivant_region();
});

document.getElementById("RechercheUpdate").addEventListener("click", () => {
  fetchDataAndGenerateChart(start_date, endDate, AASQA_ENlever.slice());
});
document.getElementById("today_button").addEventListener("click", () => {
  const currentDate = getFormattedDate(Date.now());
  document.getElementById("date").innerHTML = currentDate ;
  fetchDataAndGenerateChart(currentDate, currentDate, "hour");
});


document.getElementById("week_button").addEventListener("click", () => {
  displaydate(0, 0, 7);
});
document.getElementById("1month_button").addEventListener("click", () => {
  displaydate(0, 1);
});

document.getElementById("3month_button").addEventListener("click", () => {
  displaydate(0, 3);
});

document.getElementById("6month_button").addEventListener("click", () => {
  displaydate(0,6);
});

function displaydate(year = 0, month = 0, day = 0) {
  const currentDate = new Date();
  const oneYearAgo = new Date(year = currentDate.getFullYear() - year, month= currentDate.getMonth() - month, date = currentDate.getDate() - day);
  start_date = getFormattedDate(oneYearAgo);
  endDate = getFormattedDate(currentDate);
  document.getElementById("date").innerHTML = "De " + start_date + " à " + endDate ;
  //le .slice permet de ne plus etre relié a AASQA qui peut etre modifier pendant la recherche
  fetchDataAndGenerateChart(start_date, endDate, AASQA_ENlever.slice());
}
