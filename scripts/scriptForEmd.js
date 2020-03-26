let locations = [
  [1, "Aalborg", 57.047218, 9.920100],
  [2, "Frederikshavn", 57.442711, 10.521006],
  [3, "Aarhus", 56.162939, 10.203921]
];

// Table
for(let i = 0; i < locations.length; i++)
  {
      // create a new row
      let newRow = table.insertRow(table.length);
      for(var j = 0; j < locations[i].length; j++)
      {
          // create a new cell
          let cell = newRow.insertCell(j);

          // add value to the cell
          cell.innerHTML = locations[i][j];
      }
  }


// Map
let map = new google.maps.Map(document.getElementById("map"), {
  zoom: 6.6,
  center: new google.maps.LatLng(56.263920, 9.501785),
  mapTypeId: google.maps.MapTypeId.ROADMAP
});

let infowindow = new google.maps.InfoWindow();

let marker, i;

for (i = 0; i < locations.length; i++) {
  marker = new google.maps.Marker({
    position: new google.maps.LatLng(locations[i][2], locations[i][3]),
    map: map
  });

  google.maps.event.addListener(marker, "click", (function(marker, i) {
    return function() {
      infowindow.setContent(locations[i][0]);
      infowindow.open(map, marker);
    }
  })(marker, i));
}
