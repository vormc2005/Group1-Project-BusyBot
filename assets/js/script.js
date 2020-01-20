$(document).ready(function () {
  //TODO create error handling for if no events are returned
  //TODO allow multiple queries
  var viableEvents = [];

  //Global lat and long retrieved from user with permission
  var lat = "";
  var lon = "";
  //queries
  var searchAddress;
  var searchCity;
  var searchState;
  var searchTime;
  var searchTimeFormatted;
  var searchCategory;

  //mapQuest route queries
  var startPoint;
  //temp
  var searchTime_24;

  var travelTime;
  var timeMenuItem;
  
  var locationsDropdown = ['Washington', 'New York City', 'Philadelphia'];
  var locationAttributes = ["DC", "NY", "PA"];
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
      searchAddress="";
      searchCity = "Washington";
      searchState = "DC";
      startPoint = searchCity + ", " + searchState;
      main();
    }
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      console.log('Locating…');
      navigator.geolocation.getCurrentPosition(success, denied);
    }
  }
  function setAddress() {
    getStreet();
  }
  function setTime() {
    //Collects current Time and rounds to nearest 30 min window
    var start = moment();
    var interval = 30 - (start.minute() % 30);
    var day = moment(start).add(interval, "minutes");
    //sets current time to ISO 8601 format
    searchTime = day.format();
    // additional time to ISO 8601 format +24 hours
    searchTime_24 = moment(day).add(24, "hours");
    searchTime_24 = searchTime_24.format();
  }
  function setEvent() {
    searchCategory = "";
  }
  function main() {
    //inital set adress achieve from current location call on request prompt to user
    setTime();
    setEvent();

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
    }).then(function (response) {
      searchAddress = response.results[0].locations[0].street;
      searchCity = response.results[0].locations[0].adminArea5;
      searchState = response.results[0].locations[0].adminArea3;
      startPoint = searchAddress + ", " + searchCity + ", " + searchState;

      main();
      // getRoute(searchAddress);
    });
  }
  function search_tmaster() {
    accessTicketMaster();
  }
  // Ticket Master AJAX
  function accessTicketMaster() {
    $.ajax({
      url: "https://app.ticketmaster.com/discovery/v2/events.json?",
      method: "GET",
      data: {
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
      if( response._embedded == undefined ){
        var eventRowDOM = $('<div>');
        eventRowDOM.addClass('animated row event-row col-12 fadeInUp');
        var emptyEventDOM = $('h2');
        emptyEventDOM.text("There are no events that meet your terms. Please refresh the page and try again.");
        eventRowDOM.append(emptyEventDOM);
        eventsListDOM.append(eventRowDOM);
      } else {
        checkEvents(response);
      }
    });
  }
  function checkEvents(response) {
    eventsListDOM.empty();
    viableEvents = [];
    for (var i = 0; i < response._embedded.events.length; i++) {
      var eventTime = response._embedded.events[i].dates.start.dateTime;
      var eventAddress = response._embedded.events[i]._embedded.venues[0].name + " " +
        response._embedded.events[i]._embedded.venues[0].address.line1 + ", " +
        response._embedded.events[i]._embedded.venues[0].city.name + ", " +
        response._embedded.events[i]._embedded.venues[0].state.stateCode;
        //console.log(startPoint);
        //console.log(eventAddress);
      getRoute(startPoint, eventAddress);  

      //check to see if searchTime plus travelTime is before start of event
      //push events that fit criteria into viableEvents
      var totalTime = moment(searchTime).add(travelTime,'s').format();
      if(totalTime < response._embedded.events[i].dates.start.localTime) {
        var event = response._embedded.events[i];
        viableEvents.push(event);
        renderEvents();
      }
    }
    console.log(viableEvents);
  }
  // Travel time AJAX from currentAddress
  function getRoute(start, end) {
    $.post("http://www.mapquestapi.com/directions/v2/routematrix?key=XBEFbd4lAqBbeNeE8QyUcxIbYlnlARLz",
      "json=" + JSON.stringify({
        'locations': [start, end],
        'options': { 'allToAll': false }
      }),
      function (response) {
        //console.log(response);
        travelTime = response.time[1];
        // Round travelTime into nearest minute
        var travelMins = Math.round(travelTime / 60);
        //console.log(travelMins);
      }, "json");
  }

  //animate search btn makes everything slide up
  searchBtn.on('click', function () {
    $('.header').animate({
      'marginTop': "-120px"
    });
    searchbarDOM.animate({
      'marginTop': "1.5em"
    }, "slow");
    search_tmaster();
  });

  // Make dropdown elements
  makeDropdowns();
  function makeDropdowns() {
    for (var i = 0; i < locationsDropdown.length; i++) {
      var locationMenuItem = $('<a>');
      locationMenuItem.addClass('dropdown-item');
      locationMenuItem.addClass('location-item');
      var itemText = locationsDropdown[i];
      locationMenuItem.text(itemText);
      locationMenuItem.attr("state-code", locationAttributes[i]);
      locationMenuItem.on('click', function () {
        searchCity = $(this).text();
        searchState = $(this).attr("state-code");
        startPoint = searchCity+", "+searchState;
        inputDOM.attr('placeholder', startPoint);
        console.log(startPoint);
        // set search state to nothing for the time being
        searchState = "";
        //search_tmaster();
      });
      locationMenuDOM.append(locationMenuItem);
    }
    // Make dropdown elements
      // Get hours, push to timeDropdown array
      // military
      var currentHour = moment().format('H');
      // if the currentHour (in military time) is in the morning,
      // add up to 12 hours
      if( parseInt(currentHour) < 12){
        // while currentHour < 23, add 1
        for( var i = 0; (parseInt(currentHour) + i) < 23; i++ ){
          currentHour = moment().add(i, 'h').format('ha');
          timeDropdown.push(currentHour);
        }
      } else if( parseInt(currentHour) >= 12 ){
        for( var i = 0; (parseInt(currentHour) + i) < 20; i++ ){
          currentHour = moment().add(i, 'h').format('ha');
          timeDropdown.push(currentHour);
        }
      }
      for( var i = 0; i < timeDropdown.length; i++ ){
        timeMenuItem = $('<a>');
        timeMenuItem.addClass('dropdown-item');
        timeMenuItem.addClass('time-item');
        var itemText = timeDropdown[i];
        timeMenuItem.text(itemText);

        timeMenuItem.attr('iso86', moment().add(i, 'h').format());
        timeMenuItem.on('click', function() {
          searchTime = $(this).attr("iso86") ;
          var timeHolder = $(this).text();
          inputDOM.attr('placeholder', timeHolder);
          console.log($(this).attr("iso86"));
          //search_tmaster();
        });
        timeMenuDOM.append(timeMenuItem);
        // Grab timeMenuDom input, changint it to different time format and pasting it to a TicketMaster//
      }    
    for (var i = 0; i < categoryDropdown.length; i++) {
      var categoryMenuItem = $('<a>');
      categoryMenuItem.addClass('dropdown-item');
      categoryMenuItem.addClass('category-item');
      var itemText = categoryDropdown[i];
      categoryMenuItem.text(itemText);
      categoryMenuItem.on('click', function () {
        searchCategory = $(this).text();
        inputDOM.attr('placeholder', searchCategory);
        console.log(searchCategory);
        //search_tmaster();
      });
      
      categoryMenuDOM.append(categoryMenuItem);
    }
  }

  //render events
  function renderEvents() {
    var eventRowDOM = $('<div>');
    eventRowDOM.addClass('animated row event-row col-12 fadeInUp');
    var eventInfoDivDOM = $('<div>');
    var eventNameDOM = $('<h2>');
    var eventImageDOM = $('<img>');
    var eventImageDivDOM = $('<div>');
    var eventLocationDOM = $('<h3>');
    var eventTimeDOM = $('<p>');
    var eventPriceDOM = $('<p>');
    var eventURL;
    //make DOM elements for each array item
    for (var i = 0; i < viableEvents.length; i++) {

      //fill with info
      eventNameDOM.text(viableEvents[i].name);
      eventImageDivDOM.addClass('event-image-div col-5');
      eventInfoDivDOM.addClass('event-info-div col-7');
      eventImageDOM.attr('src', viableEvents[i].images[3].url);
      eventImageDOM.addClass('event-image');
      eventLocationDOM.text(viableEvents[i]._embedded.venues[0].name);
      eventTimeDOM.text(moment(viableEvents[i].dates.start.dateTime).format('ha'));
      //eventPriceDOM.text("$" + (viableEvents[i].priceRanges[0].min));
      // eventPriceDOM.text("$" + (viableEvents[i].priceRanges[0].min) + " -$" + (viableEvents[i].priceRanges[0].max));
      eventURL = viableEvents[i].url;

      console.log[i];

      //append to eventsListDOM
      eventImageDivDOM.append(eventImageDOM);
      eventRowDOM.append(eventImageDivDOM);
      eventRowDOM.append(eventInfoDivDOM);

      eventInfoDivDOM.append(eventNameDOM);
      eventInfoDivDOM.append(eventLocationDOM);
      eventInfoDivDOM.append(eventTimeDOM);
      eventInfoDivDOM.append(eventPriceDOM);
      // eventInfoDivDOM.append(eventURL);

      eventsListDOM.append(eventRowDOM);

      eventRowDOM.on('click', function() {
        window.open(eventURL, '_blank');
      });
      // eventRowDOM.on('mouseover', function() {
      //   eventRowDOM.addClass('animated pulse');
      // });
    }
  }

  getCurrentLocation();
})//document ready end point 