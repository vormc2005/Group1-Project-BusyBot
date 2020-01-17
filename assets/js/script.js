$(document).ready(function() {
  //get user's current location
  //pass current location into map query
  
  //pass location and current time into ticketmaster query
  //get array of objects of events
  
  //check location of events
  //check current location
  //if user can reach destination in time,
  //display event
  var viableEvents = [];
  
  //Global lat and long retrieved from user with permission
  var lat="";
  var lon ="";
  //queries
  var searchAddress;
  var searchCity;
  var searchState;
  var searchTime;
  var searchCategory;
  
  //temp
  var searchTime_24;
  
  var travelTime;
  var locationsDropdown = ['Washington', 'New York City', 'Philadelphia'];
  var timeDropdown = [];
  var categoryDropdown = ['Sports', 'Music', 'Theater', 'Dance', 'Other'];
  
  // Get DOM elements
  var searchBtn = $('#search-btn');
  var inputDOM = $('#search-input');
  var searchbarDOM = $('.search');
  var locationMenuDOM = $('.location-menu');
  var timeMenuDOM = $('.time-menu');
  var categoryMenuDOM = $('.category-menu');
  var eventsListDOM = $('.events-list');
  
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
    //Collects current Time and rounds to nearest 30 min window
    var start = moment();
    var interval = 30 - (start.minute() % 30);
    var day = moment(start).add(interval, "minutes");
    //sets current time to ISO 8601 format
    searchTime = day.format();
    // additional time to ISO 8601 format +24 hours
    searchTime_24 = moment(day).add(24, "hours");
    searchTime_24 =searchTime_24.format();
    
  }
  function setEvent(){
    searchCategory = "";
  }
  function main(){
    //inital set adress achieve from current location call on request prompt to user
    setTime();
    setEvent();
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
        searchAddress = response.results[0].locations[0].street;
        searchCity = response.results[0].locations[0].adminArea5;
        searchState = response.results[0].locations[0].adminArea3;
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
            startDateTime: searchTime,
            endDateTime: searchTime_24
        }
    }).done(function (response) {
        console.log(response);
        checkEvents(response);
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
  
    //animate search btn makes everything slide up
    searchBtn.on('click', function() {
      // $('.header').slideUp();
      $('.header').animate({
        'marginTop' : "-120px"
      });
      searchbarDOM.animate({
        'marginTop' : "1.5em"
      }, "slow");
    });
  
    makeDropdowns();
  
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
          inputDOM.attr('placeholder', searchCity);
          console.log(searchCity);
          // set search state to nothing for the time being
          searchState ="";
          search_tmaster();
        });
  
        locationMenuDOM.append(locationMenuItem);
      }
      // Get hours, push to timeDropdown array
      // military
      var currentHour = moment().format('H');
      console.log(currentHour);
      // if the currentHour (in military time) is in the morning,
      // add up to 12 hours
      if( parseInt(currentHour) < 12){
        // while currentHour < 23, add 1
        for( var i = 0; (parseInt(currentHour) + i) < 23; i++ ){
          currentHour = moment().add(i, 'h').format('ha');
  
          timeDropdown.push(currentHour);
          console.log('am');
        }
      } else if( parseInt(currentHour) >= 12 ){
        for( var i = 0; (parseInt(currentHour) + i) < 20; i++ ){
          currentHour = moment().add(i, 'h').format('ha');
          timeDropdown.push(currentHour);
          console.log('pm');
        }
      }
  
      for( var i = 0; i < timeDropdown.length; i++ ){
        var timeMenuItem = $('<a>');
        timeMenuItem.addClass('dropdown-item');
        timeMenuItem.addClass('time-item');
        var itemText = timeDropdown[i];
        timeMenuItem.text(itemText);
        timeMenuItem.attr('iso86', moment().add(i, 'h').format());
        timeMenuItem.on('click', function() {
          searchTime = $(this).text();
          inputDOM.attr('placeholder', searchTime);
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
          inputDOM.attr('placeholder', searchCategory);
          console.log(searchCategory);
          search_tmaster();
        });
  
        categoryMenuDOM.append(categoryMenuItem);
      }
    }
    getCurrentLocation();

  function checkEvents(response){
    for( var i = 0; i < response._embedded.events.length; i++ ){
      if((searchTime_24 + travelTime) < response._embedded.events[i].dates.start.dateTime) {
        var event = response._embedded.events[i];
        viableEvents.push(event);
        renderEvents();
      }
    }
  }

  //render events
  function renderEvents() {
    console.log(viableEvents);
    //make DOM elements for each array item
    for( var i = 0; i < viableEvents.length; i++ ){
      console.log("it's happening");
      var eventNameDOM = $('<h2>');
      var eventImageDOM = $('<img>');
      var eventLocationDOM = $('<h3>');
      var eventTimeDOM = $('<p>');
      var eventPriceDOM = $('<p>');
      var eventURL;

      //fill with info
      eventNameDOM.text(viableEvents[i].name);
      eventImageDOM.attr('src', viableEvents[i].images[0].url);
      eventLocationDOM.text(viableEvents[i].locate);
      eventTimeDOM.text(viableEvents[i].dates.start.dateTime);
      eventPriceDOM.text(viableEvents[i].price_range);
      eventURL.text(viableEvents[i].url);

      //append to eventsListDOM
      eventsListDOM.append(eventNameDOM);
      eventsListDOM.append(eventImageDOM);
      eventsListDOM.append(eventLocationDOM);
      eventsListDOM.append(eventPriceDOM);
      eventsListDOM.append(eventURL);
    }
  }
})//document ready end point 