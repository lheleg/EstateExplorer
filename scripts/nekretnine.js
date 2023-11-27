function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    // pozivanje metode za filtriranje
    let nekretnineLista = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });
    // iscrtavanje elemenata u divReferenca element
    nekretnineLista.forEach(nekretnina => {
        var iDiv = document.createElement('div');

        var imgElement = document.createElement('img');
        imgElement.src = "https://q-xx.bstatic.com/xdata/images/hotel/840x460/380346834.jpg?k=4d9843d659ff9390e7345f5e458849da094929f157ac5df1bc0dc64b9a84d5c5&o="; 
        imgElement.alt = 'Foto'; 
        iDiv.appendChild(imgElement);

        iDiv.appendChild(document.createElement('br'));

        var nazivPar = document.createElement('p');
        var pomocna = document.createTextNode(nekretnina.naziv);
        nazivPar.appendChild(pomocna);
        iDiv.appendChild(nazivPar);

        iDiv.appendChild(document.createElement('br'));

        var kvadraturaPar = document.createElement('p');
        pomocna = document.createTextNode(nekretnina.kvadratura + " m2");
        kvadraturaPar.appendChild(pomocna);
        iDiv.appendChild(kvadraturaPar);

        iDiv.appendChild(document.createElement('br'));

        var cijenaPar = document.createElement('p');
        cijenaPar.textContent = nekretnina.cijena + " BAM";
        cijenaPar.classList.add('cijena');
        iDiv.appendChild(cijenaPar);

        var detaljiDugme = document.createElement('button');
        detaljiDugme.innerText = 'Detalji';
        iDiv.appendChild(detaljiDugme);

        divReferenca.appendChild(iDiv);
    });
}

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }]
}]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
    },
    {
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2"
}]

//instanciranje modula
let nekretnine = SpisakNekretnina();
nekretnine.init(listaNekretnina, listaKorisnika);

//pozivanje funkcije
spojiNekretnine(divStan, nekretnine, "Stan");
spojiNekretnine(divKuca, nekretnine, "Kuća");
spojiNekretnine(divPp, nekretnine, "Poslovni prostor");

