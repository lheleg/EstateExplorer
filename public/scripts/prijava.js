document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    PoziviAjax.postLogin(username, password, (error, data) => {
        if (error) {
            console.error('Greška pri loginu', error);
        } else {
            console.log('Login rezultat:', data);
            const menuDiv = window.parent.document.getElementById('menu');
            PoziviAjax.getKorisnik(function (error, korisnik) {
                var prijavaLink = menuDiv.querySelector('#prijavaA');
                var odjavaLink = menuDiv.querySelector('#odjavaA');
                var profilLink = menuDiv.querySelector('#profilA')
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
            window.location.href = '/nekretnine.html'
        }
    });
});
