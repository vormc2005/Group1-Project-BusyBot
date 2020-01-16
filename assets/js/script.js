$(document).ready(function() {
//get user's current location
//pass current location into map query

//pass location and current time into ticketmaster query
//get array of objects of events

//check location of events
//check current location
//if user can reach destination in time,
//display event

//Global lat and long retrieved from user with permission
var lat="";
var lon ="";
//queries
var searchAddress;
var searchCity;
var searchState;
var searchTime;
var searchCategory;


var travelTime;
var locationsDropdown = ['Washington', 'New York City', 'Philadelphia'];
var timeDropdown = [];
var categoryDropdown = ['Sports', 'Music', 'Theater', 'Dance', 'Other'];

// Get DOM elements
var searchbarDOM = $('.search');
var locationMenuDOM = $('.location-menu');
var timeMenuDOM = $('.time-menu');
var categoryMenuDOM = $('.category-menu');

//HTML5 retrieve permission from user to get current location (lat and long)
function getCurrentLocation() {
  function success(position) {
    //if permission granted set call setAddress to convert lat and long to street adresss
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    setAddress();
  }
  function denied() {
    // if permission is denied set address query to "Arlington" and call main (set time and category)
    console.log('Unable to retrieve your location');
    searchCity = "Washington";
    searchState = "DC";
    main();
  }
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    console.log('Locating…');
    navigator.geolocation.getCurrentPosition(success, denied);
  }
}
function setAddress(){
  getStreet();
}
function setTime(){
  searchTime = moment().format("LL");
}
function setEvent(){
  searchCategory = "";
}
function main(){
  //inital set adress achieve from current location call on request prompt to user
  setTime();
  setEvent();
  console.log(searchAddress);
  console.log(searchCity);
  console.log(searchState)
  console.log(searchTime);
  console.log(searchCategory);
  search_tmaster();

}

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
      // console.log(response);
      searchAddress = response.results[0].locations[0].street;
      searchCity = response.results[0].locations[0].adminArea5;
      searchState = response.results[0].locations[0].adminArea3;

      console.log(searchAddress);
      console.log(searchCity);
      console.log(searchState);
      main();
      // getRoute(searchAddress);
    });
  }
  function search_tmaster(){
    accessTicketMaster();
  }
  // Ticket Master AJAX
  function accessTicketMaster(){
    $.ajax({
      url: "https://app.ticketmaster.com/discovery/v2/events.json?",
      method: "GET",
      data:{
          apikey: "xB4pwlx2qXShKTb5vBvUcL98KBiIpsdp",
          city: searchCity,
          stateCode: searchState,
          countryCode: "US",
          keyword: searchCategory,
          // startDateTime: searchTime
      }
  }).done(function (response) {
      console.log(response);
  });
  }
  // Travel time AJAX from currentAddress
  function getRoute(searchAddress){
    $.post("http://www.mapquestapi.com/directions/v2/routematrix?key=XBEFbd4lAqBbeNeE8QyUcxIbYlnlARLz",
      "json=" + JSON.stringify({
        'locations': [searchAddress, 'Washington, DC'],
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

  // Get hours, push to timeDropdown array
  var currentHour = moment().format('h');
  for( var i = 0; i < 11; i++ ){
    timeDropdown.push(parseInt(currentHour) + i);
  }
  console.log(timeDropdown);

  // Make dropdown elements
  function makeDropdowns() {

    for( var i = 0; i < locationsDropdown.length; i++ ){
      var locationMenuItem = $('<a>');
      locationMenuItem.addClass('dropdown-item');
      locationMenuItem.addClass('location-item');
      var itemText = locationsDropdown[i];
      locationMenuItem.text(itemText);
      locationMenuItem.on('click', function() {
        searchCity = $(this).text();
        console.log(searchCity);
        // set search state to nothing for the time being
        searchState ="";
        search_tmaster();
      });

      locationMenuDOM.append(locationMenuItem);
    }
    // Get hours, push to timeDropdown array
    var currentHour = moment().format('h');
    for( var i = 0; i < 11; i++ ){
      timeDropdown.push(parseInt(currentHour) + i);
    }
    console.log(timeDropdown);

    for( var i = 0; i < timeDropdown.length; i++ ){
      var timeMenuItem = $('<a>');
      timeMenuItem.addClass('dropdown-item');
      timeMenuItem.addClass('time-item');
      var itemText = timeDropdown[i];
      timeMenuItem.text(itemText);
      timeMenuItem.on('click', function() {
        searchTime = $(this).text();
        console.log(searchTime);
        search_tmaster();
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
        searchCategory = $(this).text();
        console.log(searchCategory);
        search_tmaster();
      });

      categoryMenuDOM.append(categoryMenuItem);
    }
  }
  getCurrentLocation();
})//document ready end point 