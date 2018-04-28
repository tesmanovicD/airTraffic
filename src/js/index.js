$(document).ready(function() {
  const API_URL = "https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json"
  getLocation()
    .then(function(position) {
      const userLatitude = position.coords.latitude;
      const userLongitude = position.coords.longitude;
      const between = {start: 0, end: 100}
      $.ajax({
        url: `${API_URL}?lat=${userLatitude}&lng=${userLongitude}&fDstL=${between.start}&fDstU=${between.end}`,
        dataType: "jsonp",
        success: function(data) {
          let airFlights = data.acList.slice();
          airFlights.sort((a, b) => b["Alt"] - a["Alt"])
          airFlights.forEach(flight => {
            $(".airplanes-list tbody").append(
              `<tr>
                <td>Logo</td>
                <td>${flight.Alt}</td>
                <td>${flight.CNum}</td>
              </tr>`);
          })
        }
      })
    })
    .catch(function(err) {
      console.error(err.message);
    });


})
// var getPosition = function() {
//   return new Promise(function(resolve, reject) {
//     navigator.geolocation.getCurrentPosition(resolve, reject)
//   });
// }

function getLocation() {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  });
}
