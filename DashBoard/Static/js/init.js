let start_date = getFormattedDate(new Date());
let endDate = start_date;
fetchDataAndGenerateChart(start_date, endDate, AASQA_ENlever.slice());
document.getElementById("date").innerHTML = start_date;

instanceMeteo = new ModelMeteo("Île-de-France", start_date);
instanceMeteo.obtenirMeteoJour();
instanceMeteo.mettreAJourIFrame(48.7784448, 2.441216);
const calendar = new Calendrier(instanceMeteo);

window.addEventListener("resize", function () {
  for (let i = 0; i < 7; i++) {
    setTimeout(() => {
      GraphBaton.majResize();
      GraphCercle1.majResize();
      GraphCercle2.majResize();
    }, 550);
  }
});

//===============================
// Ajout d'écouteurs d'événement
//===============================

function activateButton(buttonEl) {
  // Retire "active" sur tous les boutons
  document
    .querySelectorAll(".period-button")
    .forEach((btn) => btn.classList.remove("active"));
  buttonEl.classList.add("active");
}

document.getElementById("Bouton_pdf").addEventListener("click", function () {
  const pdfGenerator = new ModelPDF(instanceMeteo, Polluant_Non_LU);
  pdfGenerator.generatePDF();
});
/*
document
  .getElementById("bouton_precedent_region")
  .addEventListener("click", function () {
    instanceMeteo.Précédent_region();
  });*/
document.getElementById("image_option").addEventListener("click", function () {
  instanceMeteo.suivantRegion();
});

document.getElementById("RechercheUpdate").addEventListener("click", () => {
  fetchDataAndGenerateChart(start_date, endDate, AASQA_ENlever.slice());
});
const periodButtons = [
  { id: "today_button", args: ["today"] },
  { id: "week_button", args: [0, 0, 7] },
  { id: "1month_button", args: [0, 1] },
  { id: "3month_button", args: [0, 3] },
  { id: "6month_button", args: [0, 6] },
  { id: "date_expert" }, // pas d'args
];

periodButtons.forEach((btn) => {
  const buttonEl = document.getElementById(btn.id);
  buttonEl.addEventListener("click", () => {
    periodButtons.forEach((b) =>
      document.getElementById(b.id).classList.remove("active")
    );
    buttonEl.classList.add("active");

    if (btn.args) {
      if (btn.args[0] === "today") {
        const currentDate = getFormattedDate(Date.now());
        document.getElementById("date").innerHTML = `${currentDate}`;
        fetchDataAndGenerateChart(currentDate, currentDate, "hour");
      } else {
        displaydate(...btn.args);
      }
    }
  });
});
document
  .getElementById("Recherche_Range")
  .addEventListener("click", function () {
    periodButtons.forEach((b) =>
      document.getElementById(b.id).classList.remove("active")
    );
    document.getElementById("date_expert").classList.add("active");
    start_date = document.getElementById("date_Debut").value;
    endDate = document.getElementById("date_Fin").value;
    fetchDataAndGenerateChart(start_date, endDate, AASQA_ENlever.slice());
    document.getElementById("date").innerHTML = start_date + " à " + endDate;
    instanceMeteo.setDate(endDate);
    instanceMeteo.obtenirMeteoJour();
    instanceMeteo.mettreAJourIFrame();
  });

function displaydate(year = 0, month = 0, day = 0) {
  const currentDate = new Date();
  const oneYearAgo = new Date(
    (year = currentDate.getFullYear() - year),
    (month = currentDate.getMonth() - month),
    (date = currentDate.getDate() - day)
  );
  start_date = getFormattedDate(oneYearAgo);
  endDate = getFormattedDate(currentDate);
  document.getElementById("date").innerHTML = start_date + " à " + endDate;
  //le .slice permet de ne plus etre relié a AASQA qui peut etre modifier pendant la recherche
  fetchDataAndGenerateChart(start_date, endDate, AASQA_ENlever.slice());
}
