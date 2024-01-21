document.addEventListener('DOMContentLoaded', function () {
    PoziviAjax.getKorisnik((error, korisnik) => {
        if(!korisnik) {
        document.getElementById('upitForm').style.display = 'none';
        }
    })
});

document.getElementById('upitForm').addEventListener('submit', function (event) {
    event.preventDefault(); 
    const urlSearchParams = new URLSearchParams(window.location.search);
    const nekretnina_id = urlSearchParams.get('id');
    const tekst_upita = document.getElementById('tekst').value;

    PoziviAjax.postUpit(nekretnina_id, tekst_upita, (error, poruka) => {
        if(poruka){
            PoziviAjax.getKorisnik((error, korisnik) => {
            var ulElement = document.getElementById('ul_element');
            
            var liElement = document.createElement('li');

            var usernamePar = document.createElement('p');
            usernamePar.classList.add('username');
            usernamePar.textContent = korisnik.username;
            liElement.appendChild(usernamePar);

            var tekstPar = document.createElement('p');
            tekstPar.textContent = tekst_upita;
            liElement.appendChild(tekstPar);

            ulElement.appendChild(liElement);
            
            document.getElementById('upiti').appendChild(ulElement);
            document.getElementById('tekst').value = '';
        }
    )};
    });
});
