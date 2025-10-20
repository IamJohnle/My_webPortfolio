function toggleDarkMode(){
    document.body.classList.toggle("dark-mode");
    const text = document.getElementById("output");
    if (document.body.classList.contains("dark-mode")){
        text.innerText = "Code code codeeee";

    }else{
        text.innerText = "Mode mode modeeeee";
    }
}