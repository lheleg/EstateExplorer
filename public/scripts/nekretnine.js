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

        var nazivPar = document.createElement('p');
        var pomocna = document.createTextNode(nekretnina.naziv);
        nazivPar.appendChild(pomocna);
        iDiv.appendChild(nazivPar);

        iDiv.appendChild(document.createElement('br'));

        var kvadraturaPar = document.createElement('p');
        pomocna = document.createTextNode(nekretnina.kvadratura + " m2");
        kvadraturaPar.appendChild(pomocna);
        iDiv.appendChild(kvadraturaPar);

        iDiv.appendChild(document.createElement('br'));

        var cijenaPar = document.createElement('p');
        cijenaPar.textContent = nekretnina.cijena + " BAM";
        cijenaPar.classList.add('cijena');
        iDiv.appendChild(cijenaPar);

        var pretrageDiv = document.createElement('div');
        pretrageDiv.id = 'pretrage-' + nekretnina.id;
        pretrageDiv.style.padding = '10px';
        iDiv.appendChild(pretrageDiv);

        var klikoviDiv = document.createElement('div');
        klikoviDiv.id = 'klikovi-' + nekretnina.id;
        klikoviDiv.style.padding = '10px';
        iDiv.appendChild(klikoviDiv);

        var detaljiDugme = document.createElement('button');
        detaljiDugme.innerText = 'Detalji';
        iDiv.appendChild(detaljiDugme);

        divReferenca.appendChild(iDiv);
    });
    MarketingAjax.osvjeziKlikove(divReferenca);
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


