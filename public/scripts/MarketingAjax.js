const MarketingAjax = (() => {

    // njih postavljamo nakon poziva novoFiltriranje
    var filtriranje = false;
    var nekretnineIds = [];

    function impl_osvjeziPretrage(divNekretnine) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (filtriranje) {
            requestOptions.body = JSON.stringify({ nizNekretnina: nekretnineIds }); 
        }

        fetch('http://localhost:3000/marketing/osvjezi', requestOptions)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error("Greška pri osvježavanju pretraga");
                    });
                }
                return response.json();
            })
            .then(data => {
                data.nizNekretnina.forEach(nekretnina => {
                
                        const pretrageDiv = document.getElementById(`pretrage-${nekretnina.nekretnina_id}`);;
                        if (pretrageDiv) {
                            pretrageDiv.textContent = `Pretrage: ${nekretnina.broj_pretraga}`;
                        }
                    
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function impl_osvjeziKlikove(divNekretnine) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (filtriranje) {
            requestOptions.body = JSON.stringify({ nizNekretnina: nekretnineIds }); 
        }

        fetch('http://localhost:3000/marketing/osvjezi', requestOptions)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error("Greška pri osvježavanju pretraga");
                    });
                }
                return response.json();
            })
            .then(data => {
                data.nizNekretnina.forEach(nekretnina => {
                
                        const pretrageDiv = document.getElementById(`klikovi-${nekretnina.nekretnina_id}`);;
                        if (pretrageDiv) {
                            pretrageDiv.textContent = `Klikovi: ${nekretnina.broj_klikova}`;
                        }
                    
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    return {
        osvjeziPretrage : impl_osvjeziPretrage,
        osvjeziKlikove : impl_osvjeziKlikove
    };
})();
    