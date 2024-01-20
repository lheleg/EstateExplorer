const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt24", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import modela
db.korisnik = require(__dirname + '/models/korisnik.js')(sequelize, Sequelize);
db.nekretnina = require(__dirname + '/models/nekretnina.js')(sequelize, Sequelize);
db.upit = require(__dirname + '/models/upit.js')(sequelize, Sequelize);

// Relacije
// Veza 1-n, jedna nekretnina može imati više upita
db.nekretnina.hasMany(db.upit, { as: 'upitiNekretnine' });

// Veza 1-n, jedan korisnik može imati više upita
db.korisnik.hasMany(db.upit, { as: 'upitiKorisnika' });

module.exports = db;