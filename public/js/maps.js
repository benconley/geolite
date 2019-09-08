/* global $, L */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "initialMapLoad" }] */
// map component
const mymap = L.map('mapid').setView([35.7796, -78.6382], 12);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 15,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicGFuZ2VhMzMiLCJhIjoiY2swNGtoeHN0MDJwZTNucG5zanB1cnBqeSJ9.eoHKvNZDxR0Yxtnc2bxjDw',
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
