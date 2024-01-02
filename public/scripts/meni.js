document.getElementById('odjavaA').addEventListener('click', function (event) {
    PoziviAjax.postLogout((error, data) => {
        if (error) {
            console.error('Greška pri logoutu', error);
        } else {
            console.log('Logout rezultat:', data);
            autorizacija();
        }
    });
});

function autorizacija(){
        PoziviAjax.getKorisnik(function (error, korisnik) {
            var prijavaLink = document.getElementById('prijavaA');
            var odjavaLink = document.getElementById('odjavaA');
            var profilLink = document.getElementById('profilA')
            if (error) {
                prijavaLink.style.display = 'contents';
                odjavaLink.style.display = 'none';
                profilLink.style.display = 'none'
            } else{
                prijavaLink.style.display = 'none';
                odjavaLink.style.display = 'contents';
                profilLink.style.display = 'contents';
            }
        });
};

autorizacija();