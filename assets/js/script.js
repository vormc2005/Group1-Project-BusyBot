$(document).ready(function() {
//get user's current location
//pass current location into map query

//pass location and current time into ticketmaster query
//get array of objects of events

//check location of events
//check current location
//if user can reach destination in time,
//display event


var getLocationBtn = $('#getLoc');
getLocationBtn.on('click', getLocation());
var currentAddress;

var demo = document.getElementById("demo");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    demo.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude
  demo.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
  getStreet(lat, lon);
}
var apikey = '8iMbHQoKISbmKAynwHsO7ZlMhuPhWgtu';

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
    currentAddress = response.results[0].locations[0].street;
    console.log(currentAddress);
  });
}
})//document ready