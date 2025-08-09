let map;
let geocoder;
let selectedSectionLayer = null;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 23.6345, lng: -102.5528 }, // Centro de México
        zoom: 5
    });

    geocoder = new google.maps.Geocoder();

    // Cargar todas las secciones electorales desde el backend
    loadElectoralSections();

    document.getElementById('search').addEventListener('click', searchAddress);
}

async function loadElectoralSections() {
    try {
        const response = await fetch('http://localhost:3000/api/secciones');
        const geojsonData = await response.json();
        map.data.addGeoJson(geojsonData);

        // Estilo para las secciones
        map.data.setStyle({
            fillColor: 'blue',
            strokeWeight: 1,
            fillOpacity: 0.2
        });

    } catch (error) {
        console.error('Error al cargar las secciones electorales:', error);
    }
}

function searchAddress() {
    const address = document.getElementById('address').value;
    if (!address) {
        alert('Por favor, introduce una dirección.');
        return;
    }

    geocoder.geocode({ 'address': address }, async (results, status) => {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
            
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();

            // Colocar un marcador en la dirección
            new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });

            // Consultar al backend a qué sección pertenece la ubicación
            findSectionByLocation(lat, lng);

        } else {
            alert('La geocodificación no fue exitosa por la siguiente razón: ' + status);
        }
    });
}

async function findSectionByLocation(lat, lng) {
    try {
        const response = await fetch(`http://localhost:3000/api/secciones/ubicacion?lat=${lat}&lng=${lng}`);
        if (response.ok) {
            const seccion = await response.json();
            alert(`Tu sección electoral es: ${seccion.seccion}`);
            
            // Resaltar la sección encontrada
            highlightSection(seccion.seccion);

        } else {
            alert('No se pudo encontrar la sección electoral para esta ubicación.');
        }
    } catch (error) {
        console.error('Error al buscar la sección:', error);
    }
}

function highlightSection(seccionId) {
    // Limpiar la capa anterior si existe
    if (selectedSectionLayer) {
       map.data.overrideStyle(selectedSectionLayer, { fillColor: 'blue', fillOpacity: 0.2 });
    }

    // Resaltar la nueva sección
    map.data.forEach((feature) => {
        if (feature.getProperty('seccion') === seccionId) {
            selectedSectionLayer = feature;
            map.data.overrideStyle(feature, {
                fillColor: 'red',
                fillOpacity: 0.6
            });
        }
    });
}
