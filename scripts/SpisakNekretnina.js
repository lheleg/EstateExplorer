let SpisakNekretnina = function () {
    //privatni atributi modula
    let listaNekretnina = [];
    let listaKorisnika = [];

    //implementacija metoda
    let init = function (nekretnine, korisnici) {
        listaNekretnina = nekretnine;
        listaKorisnika = korisnici;
    }

    let filtrirajNekretnine = function (kriterij) {
        //Provjeri da li je kriterij prazan
        if (Object.keys(kriterij).length === 0) {
            return listaNekretnina;
        }

        //Filtriranje na osnovu kriterija
        return listaNekretnina.filter(nekretnina => {
            if (kriterij.tip_nekretnine && nekretnina.tip_nekretnine != kriterij.tip_nekretnine) {
                return false;
            }
            if (kriterij.min_kvadratura && nekretnina.kvadratura < kriterij.min_kvadratura) {
                return false;
            }
            if (kriterij.max_kvadratura && nekretnina.kvadratura > kriterij.max_kvadratura) {
                return false;
            }
            if (kriterij.min_cijena && nekretnina.cijena < kriterij.min_cijena) {
                return false;
            }
            if (kriterij.max_cijena && nekretnina.cijena > kriterij.max_cijena) {
                return false;
            }
            return true;
        });
    }

    let ucitajDetaljeNekretnine = function (id) {
        const nadjenaNekretnina = listaNekretnina.find(nekretnina => nekretnina.id === id);
        return nadjenaNekretnina || null;
    }

    return {
    init: init,
    filtrirajNekretnine: filtrirajNekretnine,
    ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};

/*
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
    tekst_upita: "Nullam eu pede mollis."
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
    }
    ]
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
    username: "username2",
}]

//primjer 1
const kriterij1 = {
tip_nekretnine: "Stan",
max_cijena: 200000
}

//primjer 2
const kriterij2 = {
    min_cijena: 100000,
    max_cijena: 200000
}
    
//primjer 3
const kriterij3 = {
    tip_nekretnine: "Poslovni prostor",
    min_kvadratura: 25,
    max_cijena: 180000
}*/
    

