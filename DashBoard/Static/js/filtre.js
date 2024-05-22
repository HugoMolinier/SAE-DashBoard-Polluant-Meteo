/**
 * Function that displays or hides graphic elements depending on the checkbox status.
 * @param {Event} event - The change event triggered.
 */
function gestionnaireChangementPolluants(event) {
    const checkbox = event.target;
    const nomCheckbox = checkbox.getAttribute("name");

    // If the checkbox is checked, display the element
    if (checkbox.checked) {
        GraphBaton.afficherElement(nomCheckbox);
        GraphCercle1.afficherElement(nomCheckbox);
        GraphCercle2.afficherElement(nomCheckbox);
        Polluant_Non_LU = Polluant_Non_LU.filter(item => item !== nomCheckbox);
    } else {
        GraphBaton.cacherElement(nomCheckbox);
        GraphCercle1.cacherElement(nomCheckbox);
        GraphCercle2.cacherElement(nomCheckbox);
        Polluant_Non_LU.push(nomCheckbox);
    }
    ModelAlerte.afficherCompteur(Polluant_Non_LU);
    ModelAlerte.afficherNotification(Polluant_Non_LU);
}

/**
 * Function that manages change events for AASQA checkboxes.
 * @param {Event} event - The change event triggered.
 */
function gestionnaireChangementAASQA(event) {
    const checkbox = event.target;
    const nomCheckbox = checkbox.getAttribute("name");

    // If the checkbox is checked, remove the element from the array
    if (checkbox.checked) {
        const index = AASQA_ENlever.indexOf(nomCheckbox);
        if (index !== -1) {
            AASQA_ENlever.splice(index, 1); // Removes element from array if present
        }
    } else {
        AASQA_ENlever.push(nomCheckbox);
    }
}

/**
 * Function that filters the stations.
 * @param {Object} data - The data to filter.
*/
function stationsFilters(data) {
    let filteraasqa = document.getElementById("filteraasq");
    filteraasqa.classList.add(".checkbox-AADQA");
    let p = document.createElement("h4")
    p.textContent = "AASQA"
    let button = document.createElement("button");
    button.id = "Selection";
    button.onclick = function() {
        toggleCheckboxes('AASQA');
    };
    p.appendChild(button);
    filteraasqa.appendChild(p);

    // Create a new overlay for the popup and add it to the map
    for (let aaqsa of Object.entries(data)) {
        let divaaqsa = document.createElement("div");
        divaaqsa.id = aaqsa[0];
        divaaqsa.classList.add("flexrow");
        let label = document.createElement("label");
        label.textContent = aaqsa[0];
        label.setAttribute("for", aaqsa[0])
        filteraasqa.appendChild(divaaqsa);
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox"
        checkbox.className="AASQA";
        checkbox.checked = true;
        checkbox.id = aaqsa[0];
        checkbox.name = aaqsa[0];
        checkbox.addEventListener("change", gestionnaireChangementAASQA);
        divaaqsa.append(checkbox);
        divaaqsa.appendChild(label);
    }

    // Sort
    const list = document.querySelector('#filteraasq');
    [...list.children].sort((a, b) => a.innerText > b.innerText ? 1 : -1).forEach(node => list.appendChild(node));
}

/**
 * Tool that allows to select all checkboxes of a class.
 * @param {string} class_checkbox - The class of the checkboxes to select.
*/
function toggleCheckboxes(class_checkbox) {
    var checkboxes = document.querySelectorAll('.'+class_checkbox);
    var checkStatus = checkboxes[0].checked;

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = !checkStatus;
        const nomCheckbox = checkbox.getAttribute("name");
        // If the checkbox is the pollutant class
        if (class_checkbox=="polluant") {
            if (checkbox.checked) {
                GraphBaton.afficherElement(nomCheckbox);
                GraphCercle1.afficherElement(nomCheckbox);
                GraphCercle2.afficherElement(nomCheckbox);
                Polluant_Non_LU = Polluant_Non_LU.filter(item => item !== nomCheckbox);
            } else {
                GraphBaton.cacherElement(nomCheckbox);
                GraphCercle1.cacherElement(nomCheckbox);
                GraphCercle2.cacherElement(nomCheckbox);
                Polluant_Non_LU.push(nomCheckbox);
            }
            ModelAlerte.afficherCompteur(Polluant_Non_LU);
            ModelAlerte.afficherNotification(Polluant_Non_LU);
        }
        // If the checkbox is the AASQA class
        if(class_checkbox=="AASQA"){
            if (checkbox.checked) {
                const index = AASQA_ENlever.indexOf(nomCheckbox);
                if (index !== -1) {
                    AASQA_ENlever.splice(index, 1); // Removes element from array if present
                }
            } else {
                AASQA_ENlever.push(nomCheckbox);
            }
        }
    });
}

// Selection of all pollutant checkboxes
const checkboxes = document.querySelectorAll('.checkbox-polluant input[type="checkbox"]');
let Polluant_Non_LU = [];
checkboxes.forEach(checkbox => { checkbox.addEventListener("change", gestionnaireChangementPolluants); });

// Selection of all AASQA checkboxes
const checkboxesAssqa = document.querySelectorAll('.checkbox-AADQA input[type="checkbox"]');
let AASQA_ENlever = [];
checkboxesAssqa.forEach(checkbox => { checkbox.addEventListener("change", gestionnaireChangementAASQA); });