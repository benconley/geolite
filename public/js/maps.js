/* global $, L */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "initialMapLoad" }] */
// map component
const mymap = L.map('mapid').setView([35.7796, -78.6382], 12);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    minZoom: 5,
    maxZoom: 15,
    zoomOffset: -1,
    id: 'mapbox/dark-v10',
    accessToken: 'pk.eyJ1IjoicGFuZ2VhMzMiLCJhIjoiY2tsYTVrYTFqMGNubjJ1czZldGF2M3B0ayJ9.8ZzX2WUEN1Sc6L3HVfuHkQ'
}).addTo(mymap);
L.marker([35.7796, -78.6382]).addTo(mymap);

function getGeoParams() {
    const bounds = mymap.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    const geoParams = {
        latArr: [northEast.lat, southWest.lat],
        longArr: [northEast.lng, southWest.lng],
    };
    return geoParams;
}
function initialMapLoad(data) {
    L.heatLayer(data, { radius: 25 }).addTo(mymap);
}

function getResults(geoParams) {
    $.ajax({
        url: 'getIpsByBoundaryBox',
        type: 'get',
        dataType: 'json',
        data: geoParams,
        beforeSend() {
            $('.loading').attr('style', 'visibility: visible');
        },
        success(data) {
            $('.loading').attr('style', 'visibility: hidden');
            L.heatLayer(data, { radius: 25 }).addTo(mymap);
        },
    });
}

function repopMap() {
    const geoParams = getGeoParams();
    getResults(geoParams);
}
mymap.on('click', repopMap);
mymap.on('moveend', repopMap);
