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
var travelTime;
var locationsDropdown = ['District of Columbia', 'New York City', 'Philadelphia'];
var timeDropdown = ['7PM', '8PM', '9PM', '10PM', '11PM', '12PM'];
var categoryDropdown = ['Sports', 'Music', 'Theater', 'Dance', 'Other'];

// Get DOM elements
var searchbarDOM = $('.search');
var locationMenuDOM = $('.location-menu');
var timeMenuDOM = $('.time-menu');
var categoryMenuDOM = $('.category-menu');

  //HTML5 get current lat and lon
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

  // Current Location Street Address AJAX from lat and lon
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
      getRoute(currentAddress);
    });
  }

  // Travel time AJAX from currentAddress
  function getRoute(currentAddress){
    $.post("http://www.mapquestapi.com/directions/v2/routematrix?key=XBEFbd4lAqBbeNeE8QyUcxIbYlnlARLz",
      "json=" + JSON.stringify({
        'locations': [currentAddress, 'Washington, DC'],
        'options': { 'allToAll': false }
      }),
      function (response) {
        console.log(response);
        travelTime = response.time[1];
        // Round travelTime into nearest minute
        var travelMins = Math.round(travelTime/60);
        console.log(travelMins);
      }, "json");
  }
  makeDropdowns();
  // Make dropdown elements
  // fill inner text with locationsDropdown, timeDropdown, categoryDropdown
  // add class dropdown-item
  // add class location/time/category-item
  // add event listeners
  function makeDropdowns() {
    for( var i = 0; i < locationsDropdown.length; i++ ){
      var locationMenuItem = $('<a>');
      locationMenuItem.addClass('dropdown-item');
      locationMenuItem.addClass('location-item');
      var itemText = locationsDropdown[i];
      locationMenuItem.text(itemText);
      locationMenuItem.on('click', function() {
        console.log($(this).text());
      });

      locationMenuDOM.append(locationMenuItem);
    }
    for( var i = 0; i < timeDropdown.length; i++ ){
      var timeMenuItem = $('<a>');
      timeMenuItem.addClass('dropdown-item');
      timeMenuItem.addClass('time-item');
      var itemText = timeDropdown[i];
      timeMenuItem.text(itemText);
      timeMenuItem.on('click', function() {
        console.log($(this).text());
      });

      timeMenuDOM.append(timeMenuItem);
    }
    for( var i = 0; i < categoryDropdown.length; i++ ){
      var categoryMenuItem = $('<a>');
      categoryMenuItem.addClass('dropdown-item');
      categoryMenuItem.addClass('category-item');
      var itemText = categoryDropdown[i];
      categoryMenuItem.text(itemText);
      categoryMenuItem.on('click', function() {
        console.log($(this).text());
      });

      categoryMenuDOM.append(categoryMenuItem);
    }
  }

})//document ready end point 