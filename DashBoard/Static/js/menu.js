// Event listener for the menu button
document.getElementById("menu").addEventListener("click", () => {
    if (filtre.style.width != "0%" && filtre.style.width != ""){
        filtre.style.width = "0%";
        document.getElementById("main").style.marginLeft = "0%";
        document.getElementById("main").style.width = "100%";
    } else {
        filtre.style.width = "15%";
        document.getElementById("main").style.marginLeft = "16%";
        document.getElementById("main").style.width = "84%";
    }
    
    // Resize the graphs
    setTimeout(() => {
        GraphBaton.majResize();GraphCercle1.majResize();GraphCercle2.majResize();
    }, 150);
});