let zoneMap;
let marker;


class Map {
    constructor(latitude, longitude, zoomLevel) {
        zoneMap = L.map('map').setView([latitude,longitude],zoomLevel);
        this.createOSMAttribution();
    }

    // creates a marker onto the map created based on the given latitude and
    // longitude onto zoneMap
    createMarker(latitude,longitude) {
        marker = L.marker([latitude,longitude]).addTo(zoneMap);
    }
    
    // layers on OpenStreetMap/Leaflet and its required attribution to zoneMap
    createOSMAttribution() {
        const attribution = '&copy; <a href= "https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tiles = L.tileLayer(tileURL,{ attribution });
        tiles.addTo(zoneMap);
    }

    // createLayers() {
    //     const blueLayer = L.geoJSON.ajax('zone-blue-north.json', {style:this.style})
    //     blueLayer.addTo(zoneMap);
    // }

    // style(feature) {
    //     return {
    //         fillColor: this.getColor(feature.properties.name),
    //         weight: 2,
    //         opacity: 1,
    //         color: 'white',
    //         dashArray: '3',
    //         fillOpacity: 0.7
    //     }
    // }

    // getColor(name) {
    //     return name == "Red-North" ? '#de2d26':
    //             name == "Blue-North" ? '#2b8cbe':
    //                                     'ffffff';
    // }

}


