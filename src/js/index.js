$(document).ready(function() {
  getLocation()
    .then(position => {
      return getAirplanesList(position)
    })
    .then(userPosition => setInterval(function() {
      getAirplanesList(userPosition)
    }, 60000))
    .catch(function(err) {
      $('.loadingCircle').hide();
      $(".airplanes-list tbody").html(
        `<tr>
          <td colspan="3" class="alert alert-danger">
            In order to see list of airplanes nearby, you need to allow the browser to get your location
          </td>
        </tr>`)
    })

  $("#close-dialog").click(function() {
    $(".flight-details").hide();
    $(".nearby-airplanes").removeClass("col-md-5");
    $(".nearby-airplanes").addClass("col-md-12");
  })

})

const API_URL = "https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json";
let airFlights;

function getLocation() {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  });
}

function getAirplanesList(position) {
  const userLatitude = position.coords.latitude;
  const userLongitude = position.coords.longitude;
  const between = {
    start: 0,
    end: 100
  }
  $.ajax({
    url: `${API_URL}?lat=${userLatitude}&lng=${userLongitude}&fDstL=${between.start}&fDstU=${between.end}`,
    dataType: "jsonp",
    beforeSend: function() {
      $('.airplanes-list tbody .airplane-data').hide();
      $('.airplanes-list tbody').html("");
      $('.loadingCircle').show();
    },
    success: function(data) {
      airFlights = data.acList.slice();
      airFlights.sort((a, b) => b["Alt"] - a["Alt"])
      airFlights.forEach(flight => {
        let planeSide = flight.long < 0 ? "west" : "east";
        $(".airplanes-list tbody").append(
          `<tr class="airplane-data" onClick="getFlightDetails(${flight.Id})">
            <td>
            <img src="img/airplane_${planeSide}.png"
                 class="img-responsive"
                 title="Going to ${planeSide} side"
                 alt="airplane-icon"/>
            </td>
            <td>${flight.Alt} ft</td>
            <td>${flight.CNum}</td>
          </tr>`);
      })
      $('.airplanes-list tbody .airplane-data').show();
      $('.loadingCircle').hide();
    }
  })
  return position;
}

function getFlightDetails(id) {
  let flight = airFlights.find(x => x.Id == id);
  let companyName = flight.Op;
  companyName ? companyName : "Unknown";
  companyName = companyName.replace(/[^\w\s]/gi, '');
  $("#airplane-manufacturer").html(flight.Man);
  $("#airplane-model").html(flight.Mdl);
  $("#airplane-company").html(companyName)
  companyName = companyName.toLowerCase().replace(/\s/g, "_");
  $("#airplane-logo").attr({
    src: `img/company/${companyName}.png`,
    alt: companyName
  });
  $(".nearby-airplanes").removeClass("col-md-12");
  $(".nearby-airplanes").addClass("col-md-5");
  $(".flight-details").show();
}
