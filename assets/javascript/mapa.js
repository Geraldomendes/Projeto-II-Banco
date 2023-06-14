import Event from "./Event.js";

let map;
const event = new Event();
let center = { lat: -6.888463202449027, lng: -38.558930105104125 };

if (document.getElementById("form")) {
  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 14,
    });
    event.register(google.maps, map);
  }
  window.initMap = initMap;
}

if (document.getElementById("exibir")) {
  event.show();
}

if(document.getElementById('edit')) {
  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 14,
    });
    event.edit(google.maps, map);
  }
  window.initMap = initMap;
}

if(document.getElementById('search')) {
  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 14,
    });
    event.search(google.maps, map);
  }
  window.initMap = initMap;
}
