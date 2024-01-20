const db = require('./db.js')
db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje početnih podataka!");
        process.exit();
    });
});

function inicializacija() {
    var korisniciListaPromisea = [];
    var nekretnineListaPromisea = [];
    var upitiListaPromisea = [];
    return new Promise(function(resolve,reject){
    upitiListaPromisea.push(db.upit.create({tekst_upita: "Nullam eu pede mollis pretium."}));
    upitiListaPromisea.push(db.upit.create({tekst_upita: "Phasellus viverra nulla."}));
    upitiListaPromisea.push(db.upit.create({tekst_upita: "Integer tincidunt."}));
    upitiListaPromisea.push(db.upit.create({tekst_upita: "Nullam eu mollis pretium."}));
    Promise.all(upitiListaPromisea).then(function(upiti){
        var upit1=upiti.filter(function(a){return a.tekst_upita==='Nullam eu pede mollis pretium.'})[0];
        var upit2=upiti.filter(function(a){return a.tekst_upita==='Phasellus viverra nulla.'})[0];
        var upit3=upiti.filter(function(a){return a.tekst_upita==='Integer tincidunt.'})[0];
        var upit4=upiti.filter(function(a){return a.tekst_upita==='Nullam eu mollis pretium.'})[0];

        korisniciListaPromisea.push(
            db.korisnik.create({
            ime: "Neko",
            prezime: "Nekic",
            username: "username1",
            password: "$2a$12$5PXeijUS9X8pbLeIa4LG3OzBA7SF6Zl34/EtAZVc3u2g2cMy5Fbqq"
            }).then(function(k){
                k.setUpitiKorisnika([upit1,upit2,upit3]);
                return new Promise(function(resolve,reject){resolve(k);});
            })
        );
        korisniciListaPromisea.push(
            db.korisnik.create({
            ime: "Lejla",
            prezime: "Heleg",
            username: "lel",
            password: "$2a$12$Wb/JQOxF3qsAfmOKQxesoOCnAlWzS8ytXqmwWndscblxltupkq35K"
        }).then(function(k){
            k.setUpitiKorisnika([upit4]);
            return new Promise(function(resolve,reject){resolve(k);});
        })
        );

        Promise.all(korisniciListaPromisea).then(function(korisnici){
            var korisnik=korisnici.filter(function(a){return a.ime==='Neko'})[0];
            var korisnica=korisnici.filter(function(a){return a.ime==='Lejla'})[0];

            nekretnineListaPromisea.push(
                db.nekretnina.create({tip_nekretnine: "Stan",
                naziv: "Useljiv stan Sarajevo",
                kvadratura: 58,
                cijena: 232000,
                tip_grijanja: "plin",
                lokacija: "Novo Sarajevo",
                godina_izgradnje: 2019,
                datum_objave: "01.10.2023.",
                opis: "Sociis natoque penatibus."}).then(function(k){
                    return k.setUpitiNekretnine([upit1,upit2,upit4]).then(function(){
                        return new Promise(function(resolve,reject){resolve(k);});
                    });
                })
            );
            nekretnineListaPromisea.push(
                db.nekretnina.create({tip_nekretnine: "Poslovni prostor",
                naziv: "Mali poslovni prostor",
                kvadratura: 20,
                cijena: 70000,
                tip_grijanja: "struja",
                lokacija: "Centar",
                godina_izgradnje: 2005,
                datum_objave: "20.08.2023.",
                opis: "Magnis dis parturient montes."}).then(function(k){
                    return k.setUpitiNekretnine([upit3]).then(function(){
                        return new Promise(function(resolve,reject){resolve(k);});
                    });
                })
            );
            Promise.all(nekretnineListaPromisea).then(function(b){resolve(b);}).catch(function(err){console.log("Nekretnine greska "+err);});
        }).catch(function(err){console.log("Korisnici greska "+err);});  
    }).catch(function(err){console.log("Upita greska "+err);});  
    });
};
