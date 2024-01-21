const PoziviAjax = (() => {

    function impl_getKorisnik(fnCallback) {
        fetch(`http://localhost:3000/korisnik`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.greska);
                });
            }
            return response.json();
        })
        .then(data => fnCallback(null, data))
        .catch(error => fnCallback(error, null));
    }

    function impl_putKorisnik(noviPodaci, fnCallback) {
        fetch(`http://localhost:3000/korisnik`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noviPodaci),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.greska);
                });
            }
            return response.json();
        })
        .then(data => fnCallback(null, data))
        .catch(error => fnCallback(error, null));
    }
    
    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        fetch(`http://localhost:3000/upit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nekretnina_id, tekst_upita }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.greska);
                });
            }
            return response.json();
        })
        .then(data => fnCallback(null, data))
        .catch(error => fnCallback(error, null));
    }


    function impl_getNekretnine(fnCallback) {
        fetch(`http://localhost:3000/nekretnine`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.greska);
                });
            }
            return response.json();
        })
        .then(data => fnCallback(null, data))
        .catch(error => fnCallback(error, null));
    }

    function impl_postLogin(username, password, fnCallback) {
        fetch(`http://localhost:3000/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.greska);
                });
            }
            return response.json();
        })
        .then(data => fnCallback(null, data))
        .catch(error => fnCallback(error, null));
    }

    function impl_postLogout(fnCallback) {
        fetch(`http://localhost:3000/logout`, {
            method: 'POST',
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.greska);
                });
            }
            return response.json();
        })
        .then(data => fnCallback(null, data))
        .catch(error => fnCallback(error, null));
    }

    function impl_getNekretninaById(nekretnina_id, fnCallback) {
        fetch(`http://localhost:3000/nekretnina/${nekretnina_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.greska);
                });
            }
            return response.json();
        })
        .then(data => fnCallback(null, data))
        .catch(error => fnCallback(error, null));
    }

    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getNekretnina: impl_getNekretninaById
    };
})();
    