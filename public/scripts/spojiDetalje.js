document.addEventListener('DOMContentLoaded', function () {
    
    const urlSearchParams = new URLSearchParams(window.location.search);
    
    const nekretninaId = urlSearchParams.get('id');

    if (nekretninaId) {
        PoziviAjax.getNekretnina(nekretninaId, (error, nekretnina) => {
            document.getElementById('naziv').innerHTML = `<b>Naziv:</b> ${nekretnina.naziv}`;
            document.getElementById('kvadratura').innerHTML = `<b>Kvadratura:</b> ${nekretnina.kvadratura} m<sup>2</sup>`;
            document.getElementById('cijena').innerHTML = `<b>Cijena:</b> ${nekretnina.cijena} BAM`;
            document.getElementById('tip').innerHTML = `<b>Tip grijanja:</b> ${nekretnina.tip_grijanja}`;
            document.getElementById('godina').innerHTML = `<b>Godina izgradnje:</b> ${nekretnina.godina_izgradnje}`;
            document.getElementById('lokacija').innerHTML = `<b>Lokacija:</b> ${nekretnina.lokacija}`;
            document.getElementById('objava').innerHTML = `<b>Datum objave:</b> ${nekretnina.datum_objave}`;
            document.getElementById('opis').innerHTML = `<b>Opis:</b> ${nekretnina.opis}`;  
            
            var ulElement = document.createElement('ul');
            nekretnina.upiti.forEach(u => {
                var liElement = document.createElement('li');

                var usernamePar = document.createElement('p');
                usernamePar.classList.add('username');
                usernamePar.textContent = u.korisnik_username;
                liElement.appendChild(usernamePar);

                var tekstPar = document.createElement('p');
                tekstPar.textContent = u.tekst_upita;
                liElement.appendChild(tekstPar);

                ulElement.appendChild(liElement);
            });
            document.getElementById('upiti').appendChild(ulElement);
        });
    }
});