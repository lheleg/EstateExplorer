function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    // pozivanje metode za filtriranje
    let nekretnineLista = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });
    // iscrtavanje elemenata u divReferenca element
    nekretnineLista.forEach(nekretnina => {
        var iDiv = document.createElement('div');
        iDiv.id = nekretnina.id;

        var imgElement = document.createElement('img');
        imgElement.src = "https://q-xx.bstatic.com/xdata/images/hotel/840x460/380346834.jpg?k=4d9843d659ff9390e7345f5e458849da094929f157ac5df1bc0dc64b9a84d5c5&o="; 
        imgElement.alt = 'Foto'; 
        iDiv.appendChild(imgElement);

        iDiv.appendChild(document.createElement('br'));

        var nazivPar = document.createElement('div');
        nazivPar.textContent = nekretnina.naziv;
        nazivPar.style.paddingLeft = "10px";
        iDiv.appendChild(nazivPar);

        iDiv.appendChild(document.createElement('br'));

        var kvadraturaPar = document.createElement('div');
        kvadraturaPar.innerHTML = nekretnina.kvadratura + " m<sup>2</sup>"
        kvadraturaPar.style.paddingLeft = "10px";
        iDiv.appendChild(kvadraturaPar);

        iDiv.appendChild(document.createElement('br'));

        var cijenaPar = document.createElement('div');
        cijenaPar.textContent = nekretnina.cijena + " BAM";
        cijenaPar.classList.add('cijena');
        iDiv.appendChild(cijenaPar);

        var lokacijaPar = document.createElement('div');
        lokacijaPar.id = 'lokacija'+nekretnina.id;
        lokacijaPar.textContent = nekretnina.lokacija;
        lokacijaPar.style.display = 'none';
        lokacijaPar.style.paddingRight = '10px';
        lokacijaPar.style.textAlign = 'right';
        iDiv.appendChild(lokacijaPar);

        var godinaPar = document.createElement('div');
        godinaPar.id = 'godina'+nekretnina.id;
        godinaPar.textContent = nekretnina.godina_izgradnje;
        godinaPar.style.display = 'none';
        godinaPar.style.paddingRight = '10px';
        godinaPar.style.textAlign = 'right';
        iDiv.appendChild(godinaPar);

        var pretrageDiv = document.createElement('div');
        pretrageDiv.id = 'pretrage-' + nekretnina.id;
        pretrageDiv.style.paddingLeft = '10px';
        iDiv.appendChild(pretrageDiv);

        var klikoviDiv = document.createElement('div');
        klikoviDiv.id = 'klikovi-' + nekretnina.id;
        klikoviDiv.style.paddingLeft = '10px';
        iDiv.appendChild(klikoviDiv);

        var detaljiDugme = document.createElement('button');
        detaljiDugme.id = 'detalji'+nekretnina.id;
        detaljiDugme.innerText = 'Detalji';
        iDiv.appendChild(detaljiDugme);

        var otvoriDetaljeDugme = document.createElement('button');
        otvoriDetaljeDugme.id = 'otvori'+nekretnina.id;
        otvoriDetaljeDugme.innerText = 'Otvori detalje';
        otvoriDetaljeDugme.style.display = 'none';
        iDiv.appendChild(otvoriDetaljeDugme);

        detaljiDugme.addEventListener('click', function () {
            const idNekretnine = nekretnina.id;
            
            nekretnineLista.forEach(nekretnina => {
                const otherDiv = document.getElementById(nekretnina.id);
                if (nekretnina.id !== idNekretnine) {
                    otherDiv.classList.remove('expanded');
                    document.getElementById('otvori'+nekretnina.id).style.display = 'none';
                    document.getElementById('godina'+nekretnina.id).style.display = 'none';
                    document.getElementById('lokacija'+nekretnina.id).style.display = 'none';
                    document.getElementById('detalji'+nekretnina.id).style.display = 'block';
                }
            });
            otvoriDetaljeDugme.style.display = 'block';
            godinaPar.style.display = 'block';
            lokacijaPar.style.display = 'block';
            detaljiDugme.style.display = 'none';
            MarketingAjax.klikNekretnina(idNekretnine);
            iDiv.classList.add('expanded');
        })

        otvoriDetaljeDugme.addEventListener('click', function () {
            window.location.href = `detalji.html?id=${nekretnina.id}`;
        })

        divReferenca.appendChild(iDiv);
    });
}

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

//instanciranje modula
let nekretnine = SpisakNekretnina();
let sveNekretnine;

PoziviAjax.getNekretnine((error, listaNekretnina) => {
    if (error) {
        console.error('Greška prilikom dobavljanja nekretnina:', error);
        return;
    }
    
    nekretnine.init(listaNekretnina);
    sveNekretnine = listaNekretnina;
    //pozivanje funkcije
    spojiNekretnine(divStan, nekretnine, "Stan");
    spojiNekretnine(divKuca, nekretnine, "Kuća");
    spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
})

document.addEventListener('DOMContentLoaded', function () {
    var searchButton = document.getElementById('searchButton');

    if (searchButton) {
        searchButton.addEventListener('click', function () {
            const minCijena = document.getElementById('minPrice').value;
            const maxCijena = document.getElementById('maxPrice').value;
            const minKvadratura = document.getElementById('minArea').value;
            const maxKvadratura = document.getElementById('maxArea').value;

            nekretnine.init(sveNekretnine);

            //instanciranje modula
            let listaNek = nekretnine.filtrirajNekretnine({ min_cijena : minCijena, max_cijena : maxCijena, min_kvadratura : minKvadratura, max_kvadratura : maxKvadratura });

            nekretnine.init(listaNek);
            
            // ukloni sadrzaj
            ukloniDivSadrzaj(divStan);
            ukloniDivSadrzaj(divKuca);
            ukloniDivSadrzaj(divPp);
            MarketingAjax.novoFiltriranje(listaNek);

            //pozivanje funkcije
            spojiNekretnine(divStan, nekretnine, "Stan");
            spojiNekretnine(divKuca, nekretnine, "Kuća");
            spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
        });
    }

    function ukloniDivSadrzaj(div) {
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
    }
});


function periodicnoPozivanje(divNekretnine) {
    setInterval(() => {
        MarketingAjax.osvjeziPretrage(divNekretnine);
    }, 500);

    setInterval(() => {
        MarketingAjax.osvjeziKlikove(divNekretnine);
    }, 500);
}

periodicnoPozivanje(divStan);
periodicnoPozivanje(divKuca);
periodicnoPozivanje(divPp);


