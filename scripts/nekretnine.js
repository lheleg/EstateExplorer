function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    // pozivanje metode za filtriranje
    let nekretnineLista = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });
    // iscrtavanje elemenata u divReferenca element
    nekretnineLista.forEach(nekretnina => {
        var iDiv = document.createElement('div');

        var imgElement = document.createElement('img');
        imgElement.src = nekretnina.imageUrl; 
        imgElement.alt = 'Foto'; 
        iDiv.appendChild(imgElement);

        iDiv.appendChild(document.createElement('br'));

        var naziv = document.createTextNode(nekretnina.naziv);
        iDiv.appendChild(naziv);

        iDiv.appendChild(document.createElement('br'));

        var kvadraturaSpan = document.createElement('span');
        var kvadratura = document.createTextNode(nekretnina.kvadratura + " m2");
        kvadraturaSpan.appendChild(kvadratura);
        iDiv.appendChild(kvadraturaSpan);

        iDiv.appendChild(document.createElement('br'));

        var cijenaSpan = document.createElement('span');
        cijenaSpan.textContent = nekretnina.cijena + " BAM";
        iDiv.appendChild(cijenaSpan);

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

