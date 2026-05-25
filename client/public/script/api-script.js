/*
----------------------------------Nearest form----------------------------------
*/
var regionFilter = document.getElementById('region'); // Menu déroulant des régions
if (regionFilter) {
    // Initialise le menu déroulant des régions
    fetch('/api/regions')
        .then(response => response.json())
        .then(data => {
            var regions = data;
            var regionFilter = document.getElementById('region');
            for (var i = 0; i < regions.length; i++) {
                var region = regions[i];
                var option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                regionFilter.appendChild(option);
            }
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('nearestForm').addEventListener('submit', function (event) {
    event.preventDefault()

    if (!event.target.checkValidity()) { // Vérifie si les champs sont remplis
        alert('Veuillez remplir tous les champs.');
        return;
    }

    var formData = new FormData(event.target); // Récupère les données du formulaire

    // Construit l'URL de la requête
    var url = '/api/nearest?latitude=' + formData.get('latitude') +
        '&longitude=' + formData.get('longitude') +
        '&nb=' + formData.get('nb') +
        '&radius=' + formData.get('radius') +
        '&population=' + formData.get('population') +
        '&region=' + formData.get('region');

    // Exécute la requête
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Affiche le résultat
            document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        })
        .catch(error => console.error('Error:', error));
});

/*
----------------------------------Regions form----------------------------------
*/
document.getElementById('regionsForm').addEventListener('submit', function (event) {
    event.preventDefault();

    if (!event.target.checkValidity()) { // Vérifie si les champs sont remplis
        alert('Veuillez remplir tous les champs.');
        return;
    }
    var formData = new FormData(event.target); // Récupère les données du formulaire

    var url = '/api/regions'; // Construit l'URL de la requête

    // Exécute la requête
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Affiche le résultat
            document.getElementById('regionsResult').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        })
        .catch(error => console.error('Error:', error));
});