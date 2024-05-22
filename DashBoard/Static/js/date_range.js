document.getElementById("date_expert").addEventListener("click", () => {
    // Display the date menu
    if(document.getElementById("date_menu").style.display != "flex"){
        document.getElementById("date_menu").style.display = "flex";
    } else {
        document.getElementById("date_menu").style.display = "none";
    }
});