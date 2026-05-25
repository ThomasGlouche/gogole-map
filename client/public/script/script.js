const API_URL = "/api/cities";
const coordCoinHautGauche = [51.39882174293374, -5.332754245480544];
const coordCoinBasDroit = [41.70469610254452, 8.529800125775425];
var carteWidth = document.getElementById('map-img').offsetWidth;
var carteHeight = document.getElementById('map-img').offsetHeight;

var mapImg = document.getElementById('map-img');
var citiesNum = document.getElementById('citiesNum');
var rangeKm = document.getElementById('rangeKm');
var population = document.getElementById('population');
var regionFilter = document.getElementById('regionFilter');

citiesNum.value = 50;
rangeKm.value = 50;
mapImg.ondragstart = function() {
    return false;
};
citiesNum.addEventListener('input', function() {
    document.getElementById('citiesSliderLabel').textContent = "Nombre de villes : " + this.value;
});

rangeKm.addEventListener('input', function() {
    document.getElementById('rangeLabel').textContent = "Radius (km) :" + this.value;
});

population.addEventListener('input', function() {
    document.getElementById('populationLabel').textContent = "Population minimale : " + this.value;
});

document.getElementById('closeInfoBox').addEventListener('click', function() {
    document.getElementById('infoBox').style.display = 'none';
});

if (regionFilter) {
    $.ajax({
        url: API_URL + '/regions',
        type: 'GET',
        success: function(data) {
            var regions = data;
            var regionFilter = document.getElementById('regionFilter');
            for (var i = 0; i < regions.length; i++) {
                var region = regions[i];
                var option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                regionFilter.appendChild(option);
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

window.onresize = function() {
    // Mise à jour des dimensions de la carte
    carteWidth = document.getElementById('map-img').offsetWidth;
    carteHeight = document.getElementById('map-img').offsetHeight;
    // Récupération de tous les marqueurs de ville
    var cityMarkers = document.querySelectorAll('.city-marker');
    // Pour chaque marqueur de ville
    for (var i = 0; i < cityMarkers.length; i++) {
        // Récupération des coordonnées de la ville
        var latitude = cityMarkers[i].dataset.latitude;
        var longitude = cityMarkers[i].dataset.longitude;
        console.log(latitude, longitude)
        // Conversion des coordonnées en pixels
        var cityCoordinates = degreesToPixel(latitude, longitude);

        // Mise à jour de la position du marqueur
        cityMarkers[i].style.left = cityCoordinates.x + 'px';
        cityMarkers[i].style.top = cityCoordinates.y + 'px';
    }
};
/*
 * Fonction qui convertit des coordonnées en pixels en coordonnées en degrés
 */
function pixelsToDegrees(x, y) {
    var carteWidth = document.getElementById('map-img').offsetWidth;
    var carteHeight = document.getElementById('map-img').offsetHeight;
    const latitude = coordCoinHautGauche[0] - (y / carteHeight) * (coordCoinHautGauche[0] - coordCoinBasDroit[0]);
    const longitude = coordCoinHautGauche[1] + (x / carteWidth) * (coordCoinBasDroit[1] - coordCoinHautGauche[1]);
    return {
        latitude: latitude,
        longitude: longitude
    };
}

function degreesToPixel(latitude, longitude) {
    var carteWidth = document.getElementById('map-img').offsetWidth;
    var carteHeight = document.getElementById('map-img').offsetHeight;
    const x = carteWidth * (longitude - coordCoinHautGauche[1]) / (coordCoinBasDroit[1] - coordCoinHautGauche[1]);
    const y = carteHeight * (coordCoinHautGauche[0] - latitude) / (coordCoinHautGauche[0] - coordCoinBasDroit[0]);
    return {
        x: x,
        y: y
    };
}
/*
 * Fonction qui convertit des coordonnées en degrés en coordonnées en pixels
 */
function getCoordinates(event) {
    var img = document.getElementById('map-img');
    var rect = img.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var coord = pixelsToDegrees(x, y)

    return coord;
}

/*
 * Fonction qui place le marqueur sur la carte
 */
function placeMarker(event) {
    var mapContainer = document.getElementById('map-container');
    var marker = document.getElementById('marker');
    var xPercentage = (event.clientX - mapContainer.offsetLeft) / mapContainer.offsetWidth * 100;
    var yPercentage = (event.clientY - mapContainer.offsetTop) / mapContainer.offsetHeight * 100;
    marker.hidden = false;
    marker.style.left = xPercentage + '%';
    marker.style.top = yPercentage + '%';
    marker.style.transform = 'translate(-50%, -60%)';
    var coord = getCoordinates(event);
    var infoBox = document.getElementById('info-box');
    var gpsCoordinates = document.getElementById('gps-coordinates');
    gpsCoordinates.textContent = 'Latitude: ' + coord.latitude.toFixed(2) + ', Longitude: ' + coord.longitude.toFixed(2);
    infoBox.style.display = 'block';
    infoBox.style.left = marker.style.left;
    infoBox.style.top = (parseFloat(marker.style.top) - 10) + '%'; // Position the info box above the marker
    infoBox.style.transform = 'translate(-50%, 0)';
    var latitude = coord.latitude;
    var longitude = coord.longitude;
    marker.value = {
        latitude: latitude,
        longitude: longitude
    };
    marker.dataset.latitude = latitude;
    marker.dataset.longitude = longitude;
    var nb = document.getElementById('citiesNum').value;
    var radius = document.getElementById('rangeKm').value;
    var population = document.getElementById('population').value;
    var region = document.getElementById('regionFilter').value;
    showCities(latitude, longitude, nb, radius, population, region);
}

/*
 * Fonction pour appeler l'API
 */
function showCities(latitude, longitude, nb, radius, population, region) {
    $.ajax({
        url: API_URL + '/nearest?latitude=' + latitude + '&longitude=' + longitude + '&nb=' + nb + '&radius=' + radius + '&population=' + population + '&region=' + region,
        type: 'GET',
        success: function(data) {
            removeCities();
            var cities = data;
            var cityMarkerTemplate = document.querySelector('.city-marker-template');


            for (var i = 0; i < cities.length; i++) {
                var city = cities[i];
                var cityCoordinates = degreesToPixel(city.latitude, city.longitude);
                console.log(cityCoordinates.x)
                var multiplicator = carteHeight / 850;
                var cityMarker = cityMarkerTemplate.cloneNode(true);
                cityMarker.classList.remove('city-marker-template');
                cityMarker.classList.add('city-marker');
                cityMarker.hidden = false;
                cityMarker.style.left = cityCoordinates.x + 'px';
                cityMarker.style.top = cityCoordinates.y + 'px';
                cityMarker.title = 'Ville: ' + '<strong>' + city.name + '</strong>' + '<br>' +
                    'Distance: ' + '<strong>' + city.distance.toFixed(0) + '</strong>' + ' km' + '<br>' +
                    'Population: ' + '<strong>' + city.population + '</strong>' + '<br>' +
                    'Region: ' + '<strong>' + city.region + '</strong>';
                cityMarker.id = 'city-marker-' + i; // Ajoutez un identifiant unique
                // Stockage des coordonnées de la ville dans les attributs data-
                cityMarker.dataset.latitude = city.latitude;
                cityMarker.dataset.longitude = city.longitude;
                cityMarker.dataset.distance = city.distance;
                cityMarker.dataset.population = city.population;
                
                document.getElementById('map-container').appendChild(cityMarker);
                citiesList(city, i); // Passez l'index à la fonction citiesList
            }
            // Initialise les tooltips
            $('[data-toggle="tooltip"]').tooltip({
                html: true
            });

        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}
/*
 * Fonction pour afficher la liste des villes
 */
function citiesList(city, index) {
    var cityList = document.getElementById('city-list');
    var cityMarker = document.getElementById('city-marker-' + index);
    var listItem = document.createElement('li');
    var summary = document.createElement('summary');

    listItem.classList.add('city-item');
    listItem.id = 'city-item-' + index; // Ajoutez un identifiant unique
    summary.innerHTML = '[ ' + city.distance.toFixed(0) + ' km ] ' + '<strong>' + city.name + '</strong>';

    listItem.appendChild(summary);
    cityList.appendChild(listItem);

    // Ajoutez des gestionnaires d'événements pour les événements mouseover et mouseout
    listItem.addEventListener('mouseover', function() {
        document.getElementById('city-marker-' + index).style.transform = 'translate(-50%, -50%) scale(1.5)';
        $('#city-marker-' + index).tooltip('show');

    });
    listItem.addEventListener('mouseout', function() {
        document.getElementById('city-marker-' + index).style.transform = 'translate(-50%, -50%)';
        $('#city-marker-' + index).tooltip('hide');
    });
    cityMarker.addEventListener('mouseover', function() {
        listItem.style.backgroundColor = '#f5f5f5';
        listItem.style.fontWeight = 'bold';
        // Get the parent container
        var container = listItem.parentNode;

        // Scroll the container
        container.scrollTop = listItem.offsetTop - container.offsetTop;
    });
    cityMarker.addEventListener('mouseout', function() {
        listItem.style.backgroundColor = '';
        listItem.style.fontWeight = '';
    });

    listItem.addEventListener('click', function() {
        var cityName = city.name;

        document.getElementById('cityName').textContent = cityName;
        document.getElementById('cityRegion').textContent = city.region;
        document.getElementById('cityLatitude').textContent = city.latitude;
        document.getElementById('cityLongitude').textContent = city.longitude;
        document.getElementById('cityPopulation').textContent = city.population;
        document.getElementById('cityDistance').textContent = city.distance.toFixed(0);

        document.getElementById('infoBox').style.display = 'block';
    });
}

/*
 * Fonction pour supprimer les marqueurs de villes
 */
function removeCities() {
    var cityList = document.getElementById('city-list');
    cityList.innerHTML = ''; // Clear the list
    var cities = document.querySelectorAll('.city-marker');
    for (var i = 0; i < cities.length; i++) {
        cities[i].remove();
    }
}
