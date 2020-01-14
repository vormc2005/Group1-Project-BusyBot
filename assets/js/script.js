$(document).ready(function() {
//get user's current location
//pass current location into map query

//pass location and current time into ticketmaster query
//get array of objects of events

//check location of events
//check current location
//if user can reach destination in time,
//display event

// var apikey = 'AIzaSyCdwSi0A_uN2spOdWzV1sDL0U0s9erF9Dc';
// getMap();
// function getMap(city){
//   $.ajax({
//     url: 'https://maps.googleapis.com/maps/api/js',
//     method: 'GET',
//     data: {
//       key: apikey,
//     }
//   }).then(function(response) {
//     console.log(response);
//   });
// }//getMap()
var btn = $('#getLoc');
btn.on('click', getLocation());

var x = document.getElementById("demo");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude
  x.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
  getStreet(lat, lon);
}
var apikey= '8iMbHQoKISbmKAynwHsO7ZlMhuPhWgtu';

function getStreet(lat, lon) {
  $.ajax({
    url: 'http://www.mapquestapi.com/geocoding/v1/reverse',
    dataType: 'json',
    method: 'GET',
    data: {
      location: lat + "," + lon,
      key: apikey,
    }
  }).then(function(response) {
    console.log(response);
  });
}
})//document ready