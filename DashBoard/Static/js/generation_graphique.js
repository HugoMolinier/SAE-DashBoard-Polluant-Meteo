// Get all graphs models
const GraphBaton = new ModelGraph();
const GraphCercle1 = new ModelGraph();
const GraphCercle2 = new ModelGraph();
let cancel;

/**
 * Asynchronous function that retrieves the data to generate the curve and displays it.
 * @param {string} date_debut - The start date for which the data should be retrieved, in the format "YYYY-MM-DD".
 * @param {string} date_fin - The end date for which the data should be retrieved, in the format "YYYY-MM-DD".
 * @returns {Promise<void>} A promise resolved once the data has been retrieved and the chart has been generated.
 */   
async function fetchDataAndGenerateChart(date_début, date_fin,aaqsaRem,codeStation=null) {
  // Cancel the previous request if it exists
  if (cancel) cancel();
  let cancelMe = false;
  cancel = () => {
    cancelMe = true;
  }
  ModelAlerte.supprimerToutAlerte();
  const roueChargement = document.getElementById("loading-circle");
  roueChargement.style.display = "block"; 
  const instanceModelRecolte = new ModelRecolte();
  var nombre_jour=0;
  let moyenneData = {};
  let moyenneDataGraph=[];
  GraphBaton.setData([]);

  // Get the number of stations
  const nombre_station = (await instanceModelRecolte.obtenirDataAPI("/api/NombreStation?AASQA=["+aaqsaRem.toString()+"]"));    
  document.getElementById('nombre_TEXT_station').innerHTML =  nombre_station['nombre station'] ;

  // Get the number of pollutants
  var nombre_element=0;
  GraphBaton.setData([]);
  for (let date = new Date(date_fin); date >= new Date(date_début); date.setDate(date.getDate() - 1)) {
    if (cancelMe) return; 
      nombre_jour+=1;
      const dataGraph = (await instanceModelRecolte.obtenirDataAPI("/api/GetFormatGraph?count=-1&date=" +  getFormattedDate(date)+"&AASQA=["+aaqsaRem.toString()+"]&code="+codeStation));
      
      GraphBaton.setData(instanceModelRecolte.fusionnerDeuxArrays(GraphBaton.getdata(),dataGraph)); 
      nombre_element+=dataGraph[0].length-1;
      moyenneData = instanceModelRecolte.formatMoyenne(moyenneData,dataGraph);
      moyenneDataGraph=instanceModelRecolte.transformeMoyenneGraphique(moyenneData);
      instanceModelRecolte.afficherNombreValeur(nombre_element);
      ModelAlerte.afficherNotification();
      ModelAlerte.afficherCompteur();

      GraphBaton.detruireGraph()
      GraphBaton.generateGraphEnBaton(nombre_jour<=9);

      GraphCercle1.setData(moyenneDataGraph.slice(0, 4));
      GraphCercle1.detruireGraph()
      GraphCercle1.generateGraphEssuieGlace("essuis1");

      GraphCercle2.setData(moyenneDataGraph.slice(4, 9));
      GraphCercle2.detruireGraph()
      GraphCercle2.generateGraphEssuieGlace("essuis2");
  }
  roueChargement.style.display = "none";
}