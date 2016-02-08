var eventsRef = new Firebase('https://sweltering-inferno-2083.firebaseio.com/')


function validate($el) {
  var value = $el.val();
  var id = $el.attr('id');
  if (id === "guests"){
    checkGuestPresence();
  } else if (id === "pac-input"){
    checkLocation(); 
  } else {
    checkInputValidation($el); 
  }
}

function checkInputValidation ( $el ) {
    var className = $el.attr('id');
    if($el[0].validationMessage !== ""){
      $el.parent().addClass('has-error');
      $('span.help-block.' + className).text($el[0].validationMessage);
    } else {
      $el.parent().removeClass('has-error');
      $el.parent().addClass('has-success');
      fillProgressBar();
      $('span.help-block.' + className).text("");
    }   
    
}

function checkGuestPresence(){
  var guestsArray = $('#guests').val();
  if(guestsArray === null ){
    $('.guests').text("Please invite at least one guest.");
    $('.guests').addClass('has-error');
  } else {
    $('span.help-block.guests').removeClass('has-error');
    $('#guests').addClass('has-success');
    fillProgressBar();
    $('span.help-block.guests').text("");

  }
}

function checkLocation(){
  var address = $('#pac-input').val();
  if (address === ""){
    $('.location').text("Please fill out address.");
    $('.location').addClass('has-error');
  } else {
    $('.location').removeClass('has-error');
    $('.location').addClass('has-success');
    fillProgressBar();
    $('.location').text("");
  }
}

function fillProgressBar(){
  var progress = parseInt($('.progress-bar').attr('aria-valuenow'));
  progress = ($('.has-success').length / $('.must').length) * 100.0;
  $('.progress-bar').attr('aria-valuenow', progress);
  $('.progress-bar').css('width',   progress +'%');

};

function wholeValidation(){
  $('.must').each( function(index){
    validate($(this)); 
  });
}

$(function () {
  var timeNow = new Date();
  hourNow = timeNow.getHours();
  var oneHourLater = new Date();
  oneHourLater.setHours(hourNow + 1); 
  
  $('input.must').on('blur', function(e){
    var $el = $(e.currentTarget);
    validate($el);
  })

  $("#guests").select2().on('select2-open', function(e){
    var $el = $(e.currentTarget);
    validate($el);
  })


  $('#start_date').datetimepicker({ defaultDate: timeNow, stepping: 30, sideBySide: true}); 
  $('#end_date').datetimepicker({ minDate: timeNow, defaultDate: oneHourLater, stepping: 30, sideBySide: true }); 



  $('#start_date').on('dp.change', function(){
    var startTime = $('#start_date').val();
    $('#end_date').val(startTime);
  });

  $('button#submit').on('click', function(event){
    event.preventDefault();
    wholeValidation();
    console.log("click");
    if ($('.has-error').length === 0){
      console.log("test");
      var name = $('input#eventName').val();
      var type = $('input#eventType').val();
      var host = $('input#eventHost').val();
      var startDate = $('input#start_date').val();
      var endDate = $('input#end_date').val();
      var guests = $('#guests').val();
      var location = $('#pac-input').val();
      var memo = $('input#memo').val();
      eventsRef.push({ name: name, type: type, host: host, startDate: startDate, endDate: endDate, guests: guests, location: location, memo: memo})

    window.location.href = "/"
    } else {
      alert("wrong information");
    }
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
