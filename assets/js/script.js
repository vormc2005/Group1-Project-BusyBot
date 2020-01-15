$(document).ready(function() {
//get user's current location
//pass current location into map query

//pass location and current time into ticketmaster query
//get array of objects of events

//check location of events
//check current location
//if user can reach destination in time,
//display event

var lat="";
var lon ="";
var currentAddress = "";

  function getCurrentLocation() {
      function success(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log(lat);
        console.log(lon);
        getStreet();
      }
      function error() {
        console.log('Unable to retrieve your location');
      }
      if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
      } else {
        console.log('Locating…');
        navigator.geolocation.getCurrentPosition(success, error);
      }
    }
    getCurrentLocation();
    
  // Ticket Master AJAX
  $.ajax({
      url: "https://app.ticketmaster.com/discovery/v2/events.json?",
      method: "GET",
      data:{
          apikey: "xB4pwlx2qXShKTb5vBvUcL98KBiIpsdp",
          countryCode: "US",
          keyword: ""
      }
  }).done(function (response) {
      console.log(response);
  });
  // Current Location Street Adress AJAX
  function getStreet() {
    var apikey = '8iMbHQoKISbmKAynwHsO7ZlMhuPhWgtu';
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
 


//document ready end point 
});