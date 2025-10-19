document.addEventListener("DOMContentLoaded",function()
{
    const btnAboutme = document.getElementById
    ('btn-aboutme');
    const divAboutme = document.getElementById('info');

    btnAboutme.addEventListener('click', function(){
        if(divAboutme.classList.contains('hide')){
            divAboutme.classList.remove('hide');
            btnAboutme.textContent = "Show Less";

        }else{
            divAboutme.classList.add('hide');
            btnAboutme.textContent = "ABOUT ME";
        }


    });
});