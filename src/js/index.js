$(document).ready(function() {
  getLocation()
    .then(position => { return getAirplanesList(position) })
    .then(userPosition => setInterval(function(){
        getAirplanesList(userPosition)
    }, 60000))
    .catch(function(err) {
      $(".airplanes-list tbody").html(
        `<tr>
          <td colspan="3" class="alert alert-danger">
            In order to see list of airplanes nearby, you need to allow the browser to get your location
          </td>
        </tr>`)
    })

})

const API_URL = "https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json";

function getLocation() {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  });
}

function getAirplanesList(position) {
  const userLatitude = position.coords.latitude;
  const userLongitude = position.coords.longitude;
  const between = {start: 0, end: 100}
  $.ajax({
    url: `${API_URL}?lat=${userLatitude}&lng=${userLongitude}&fDstL=${between.start}&fDstU=${between.end}`,
    dataType: "jsonp",
    beforeSend: function() {
      $('.airplanes-list tbody .airplane-data').hide();
      $('.airplanes-list tbody .airplane-data').html("");
      $('.loadingCircle').show();
    },
    success: function(data) {
      let airFlights = data.acList.slice();
      airFlights.sort((a, b) => b["Alt"] - a["Alt"])
      airFlights.forEach(flight => {
        let planeSide = flight.long < 0 ? "west" : "east";
        $(".airplanes-list tbody").append(
          `<tr class="airplane-data">
            <td><img src="img/airplane_${planeSide}.png" class="img-responsive" title="Going to ${planeSide} side"/></td>
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
