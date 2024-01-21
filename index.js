const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const { error } = require('console');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./config/db.js')


const app = express();

app.use(bodyParser.json());

app.use(session({
    secret: 'lelas secret key',
    resave: false,
    saveUninitialized: true,
}));

const autorizovano = (req, res, next) => {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
};

app.use('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Login ruta
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.korisnik.findOne({ where: { username: username } }).then(function (korisnik) {
        if (korisnik) {
            bcrypt.compare(password, korisnik.password, function(err, result) {
                if (err) {
                    res.status(401).json({ greska: 'Greška pri usporedbi lozinki' });
                } else if (result) {
                    req.session.username = username;
                    res.status(200).json({ poruka: 'Uspješna prijava' });
                } else {
                    res.status(401).json({ greska: 'Neuspješna prijava' });
                }
            });
        } else {
            res.status(401).json({ greska: 'Neuspješna prijava' });
        }
    });
});

// Logout ruta
app.post('/logout', autorizovano, (req, res) => {
    req.session.username = null;
    res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
});

// Korisnik ruta (get)
app.get('/korisnik', autorizovano, (req, res) => {  
    db.korisnik.findOne({ where: { username: req.session.username } }).then(function(korisnik){
        if (korisnik) {
            res.status(200).json({
            id: korisnik.id,
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            username: korisnik.username,
            });
        } else {
            res.status(401).json({ greska: 'Neautorizovan pristup' });
        }
    });
});

// Upit ruta
app.post('/upit', autorizovano, (req, res) => {
    const { nekretnina_id, tekst_upita } = req.body;
    var korisnik;
    var nekretnina;
    db.korisnik.findOne({
        where: { username: req.session.username }
    }).then((nadjeniKorisnik) => {
        if (!nadjeniKorisnik) {
            res.status(401).json({ greska: 'Neautorizovan pristup' });
            return Promise.reject('Neautorizovan pristup');
        }
        korisnik = nadjeniKorisnik;
        return db.nekretnina.findByPk(nekretnina_id);
    }).then((nadjenaNekretnina) => {
        if (!nadjenaNekretnina) {
            res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
            return Promise.reject(`Nekretnina sa id-em ${nekretnina_id} ne postoji`);
        }
        nekretnina = nadjenaNekretnina;
        return db.upit.create({ tekst_upita: tekst_upita }).then(function(upit){
            korisnik.addUpitiKorisnika([upit]);
            nekretnina.addUpitiNekretnine([upit]);
        });
    }).then(() => {
        res.status(200).json({ poruka: 'Upit je uspješno dodan' });
    }).catch((error) => {
        console.error('Greška:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    });
})

// Korisnik ruta (put)
app.put('/korisnik', autorizovano, (req, res) => {
    const { ime, prezime, username, password } = req.body;
    var korisnik;
    db.korisnik.findOne({
        where: { username: req.session.username }
    }).then((nadjeniKorisnik) => {
        if (!nadjeniKorisnik) {
            res.status(401).json({ greska: 'Neautorizovan pristup' });
            return Promise.reject('Neautorizovan pristup');
        }
        korisnik = nadjeniKorisnik;
        if (ime) korisnik.ime = ime;
        if (prezime) korisnik.prezime = prezime;
        if (username) korisnik.username = username;
        if (password) {
            return bcrypt.hash(password, 10).then((hash) => {
                korisnik.password = hash;
            });
        }

        return Promise.resolve();
    }).then(() => {
        return korisnik.save();
    }).then(() => {
        res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
    }).catch((error) => {
        console.error('Greška:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    });
});

// Nekretnine ruta
app.get('/nekretnine', (req, res) => {
    db.nekretnina.findAll({
        include: {
            model: db.upit,
            as: 'upitiNekretnine',
            where: { nekretninaId: db.Sequelize.col('nekretnina.id') },
        },
    }).then((nekretnine) => {
        const nekretnineData = nekretnine.map((nekretnina) => {
            const upiti = nekretnina.upitiNekretnine || []; 
            return {
                id: nekretnina.id,
                tip_nekretnine: nekretnina.tip_nekretnine,
                naziv: nekretnina.naziv,
                kvadratura: nekretnina.kvadratura,
                cijena: nekretnina.cijena,
                tip_grijanja: nekretnina.tip_grijanja,
                lokacija: nekretnina.lokacija,
                godina_izgradnje: nekretnina.godina_izgradnje,
                datum_objave: nekretnina.datum_objave,
                opis: nekretnina.opis,
                upiti: upiti.map((upit) => {
                    return {
                        id: upit.id,
                        tekst_upita: upit.tekst_upita
                    };
                }),
            };
        });
        res.status(200).json(nekretnineData);
    }).catch((error) => {
        console.error('Greška:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    });
});

// Nekretnina po id ruta
app.get('/nekretnina/:id', (req, res) => {
    const id = +req.params.id;

    db.nekretnina.findByPk(id, { include: 'upitiNekretnine' }).then((nekretnina) => {
        if (nekretnina) {
            const upiti = nekretnina.upitiNekretnine.map(async (upit) => {
                const korisnik = await db.korisnik.findByPk(upit.KorisnikId);
                return {
                    id: upit.id,
                    tekst_upita: upit.tekst_upita,
                    korisnik_username: korisnik ? korisnik.username : null
                };
            });
            Promise.all(upiti).then((resolvedUpiti) => {
                res.status(200).json({
                    id: nekretnina.id,
                    tip_nekretnine: nekretnina.tip_nekretnine,
                    naziv: nekretnina.naziv,
                    kvadratura: nekretnina.kvadratura,
                    cijena: nekretnina.cijena,
                    tip_grijanja: nekretnina.tip_grijanja,
                    lokacija: nekretnina.lokacija,
                    godina_izgradnje: nekretnina.godina_izgradnje,
                    datum_objave: nekretnina.datum_objave,
                    opis: nekretnina.opis,
                    upiti: resolvedUpiti
                });
            });
        } else {
            res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        }
    }).catch((error) => {
        console.error('Greška:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    });
});

// Marketing nekretnine
app.post('/marketing/nekretnine', (req, res) => {
    const { nizNekretnina } = req.body;

    db.nekretnina.findAll({
        where: {
            id: nizNekretnina
        }
    }).then((nekretnine) => {
        nekretnine.forEach((nekretnina) => {
            nekretnina.update({
                broj_pretraga: nekretnina.broj_pretraga + 1
            });
        });
        return Promise.all(nekretnine.map((nekretnina) => nekretnina.save()));
    }).then(() => {
        res.status(200).send();
    }).catch((error) => {
        console.error('Greška:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    });
});

// Marketing nekretnina :id
app.post('/marketing/nekretnina/:id', (req, res) => {
    const id = +req.params.id;

    db.nekretnina.findByPk(id).then((nekretnina) => {
        if (nekretnina) {
            nekretnina.update({
                broj_klikova: nekretnina.broj_klikova + 1
            });

            return nekretnina.save();
        } 
    }).then(() => {
        res.status(200).send();
    }).catch((error) => {
        console.error('Greška:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    });
});

const prethodnoPromijenjeneNekretnine = [];
app.post('/marketing/osvjezi', (req, res) => {
    const { nizNekretnina } = req.body;
    if (!Array.isArray(req.session.nizNekretnina)) req.session.nizNekretnina = [];
    const nekretnineIds = nizNekretnina || req.session.nizNekretnina;
    const promijenjeneNekretnine = [];

    db.nekretnina.findAll({
        where: {
            id: nekretnineIds
        }
    }).then((nekretnine) => {
        nekretnine.forEach((nekretnina) => {
            const promNek = prethodnoPromijenjeneNekretnine.find(p => p.nekretnina_id === nekretnina.id);
            if (!req.session.nizNekretnina.includes(nekretnina.id)) {
                promijenjeneNekretnine.push({
                    nekretnina_id: nekretnina.id,
                    broj_pretraga: nekretnina.broj_pretraga,
                    broj_klikova: nekretnina.broj_klikova
                });
            } else if (promNek && (promNek.broj_klikova !== nekretnina.broj_klikova || promNek.broj_pretraga !== nekretnina.broj_pretraga)) {
                promijenjeneNekretnine.push({
                    nekretnina_id: nekretnina.id,
                    broj_pretraga: nekretnina.broj_pretraga,
                    broj_klikova: nekretnina.broj_klikova
                });
            }
        });

        if (promijenjeneNekretnine.length > 0) {
            prethodnoPromijenjeneNekretnine.length = 0;
            Array.prototype.push.apply(prethodnoPromijenjeneNekretnine, promijenjeneNekretnine);
        }

        req.session.nizNekretnina = nekretnineIds;

        res.status(200).json({ nizNekretnina: promijenjeneNekretnine });
    }).catch((error) => {
        console.error('Greška:', error);
        res.status(500).json({ greska: 'Internal Server Error' });
    });
});

// dio za ucitavanje stranica
app.use(express.static(path.join(__dirname, 'public')));

app.get('/:stranica', (req, res) => {
    const stranica = req.params.stranica;
    res.sendFile(path.join(__dirname, 'public', 'html',`${stranica}`));
});

app.listen(3000, () => {
    console.log(`Server is running`);
});