var eventsRef = new Firebase('https://sweltering-inferno-2083.firebaseio.com/')

function checkValidation ( $el ) {
    if($el[0].validationMessage !== ""){
      $el.parent().addClass('has-error');
      var className = $el.attr('id');
      $('span.help-block.' + className).text($el[0].validationMessage)
    }   
}

function checkGuestPresence(){
  var guestsArray = $('#guests').val();
  if(guestsArray === null ){
    $('.guests').text("Please invite at least one guest.");
  }
}

function checkWholeValidations(){
  var name = $('input#eventName').val();
  var type = $('input#eventType').val();
  var host = $('input#eventHost').val();
  var startDate = $('input#start_date').val();
  var endDate = $('input#end_date').val();
  var guests = $('#guests').val();
  var location = $('#pac-input').val();
  var memo = $('input#memo').val();

  checkValidation($('input#eventName'));
  checkValidation($('input#eventType'));
  checkValidation($('input#eventHost'));
  checkValidation($('input#start_date'));
  checkValidation($('input#end_date'));
  checkGuestPresence();
  checkLocation();

}
function checkLocation(){
  var address = $('#pac-input').val();
  if (address === ""){
    $('.location').text("Please fill out address.");
  }
}
$(function () {
  var dateNow = new Date();
  hourNow = dateNow.getHours();
  var OneHourLater = new Date(dateNow);
  OneHourLater.setHours(hourNow + 1); 
  $('#start_date').datetimepicker({ minDate: dateNow, defaultDate: dateNow , stepping: 30, sideBySide: true}); 
  $('#end_date').datetimepicker({ minDate: dateNow, defaultDate: OneHourLater, stepping: 30, sideBySide: true }); 
  $("#guests").select2();


  $('button#submit').on('click', function(event){
    checkWholeValidations();
    eventsRef.push({ name: name, type: type, host: host, startDate: startDate, endDate: endDate, guests: guests, location: location, memo: memo})
    // window.location.href = "/event_form"
  });


});
function initAutocomplete() {
  
  var initialLocation;
  var myOptions = {
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map"), myOptions);
 // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  } 

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);

  });

  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
  }
  // [END region_getplaces]
}
