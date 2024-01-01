const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const { error } = require('console');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

app.use(bodyParser.json());

app.use(session({
    secret: 'lelas secret key',
    resave: false,
    saveUninitialized: true,
}));

var korisniciData = null
fs.readFile('data/korisnici.json', 'utf-8', (err, data) => {
    if (err) {
        console.error('Greška pri čitanju:', err);
    } else {
        korisniciData = JSON.parse(data);
    }
});

var nekretnineData = null
fs.readFile('data/nekretnine.json', 'utf-8', (err, data) => {
    if (err) {
        console.error('Greška pri čitanju:', err);
    } else {
        nekretnineData = JSON.parse(data);
    }
})

const autorizovano = (req, res, next) => {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
};

// Login ruta
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const korisnik = korisniciData.find(k => k.username === username);

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

// Logout ruta
app.post('/logout', autorizovano, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Greška pri brisanju sesije:', err);
            res.status(500).json({ greska: 'Internal Server Error' });
        } else {
            res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
        }
    });
});

// Korisnik ruta
app.get('/korisnik', autorizovano, (req, res) => {  
    const korisnik = korisniciData.find(k => k.username === req.session.username);
    
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

// Upit ruta
app.post('/upit', autorizovano, (req, res) => {
    const { nekretnina_id, tekst_upita } = req.body;

    const korisnik = korisniciData.find(k => k.username === req.session.username);

    if (!korisnik) {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
        return;
    }

    const nekretnina = nekretnineData.find(n => n.id === nekretnina_id);

    if (!nekretnina) {
        res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
        return;
    }

    const noviUpit = { id_korisnika: korisnik.id, tekst_upita: tekst_upita };

    nekretnina.upiti.push(noviUpit);

    fs.writeFile('data/nekretnine.json', JSON.stringify(nekretnineData, null, 2), 'utf-8', (err) => {
        if (err) {
            console.error('Greška pri upisu nekretnine.json:', err);
            res.status(500).json({ greska: 'Internal Server Error' });
        } else {
            res.status(200).json({ poruka: 'Upit je uspješno dodan' });
        }
    });

    fs.readFile('data/nekretnine.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Greška pri čitanju:', err);
        } else {
            nekretnineData = JSON.parse(data);
        }
    });

})

/* Korisnik rutu
app.put('/korisnik', (req, res) => {
    const { ime, prezime, username, password } = req.body;

    
})*/

// Ignore favicon.ico zahtjeve
//app.get('/favicon.ico', (req, res) => res.status(204));

// dio za ucitavanje stranica
app.use(express.static(path.join(__dirname, 'public')));

app.get('/:stranica', (req, res) => {
    const stranica = req.params.stranica;
    res.sendFile(path.join(__dirname, 'public', 'html',`${stranica}`));
});

app.listen(3000, () => {
    console.log(`Server is running`);
});