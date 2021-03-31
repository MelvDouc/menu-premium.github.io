// https://stackoverflow.com/questions/39329874/googlemaps-api-key-for-localhost
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

let userCoords;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    userCoords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  });
} else alert("Votre navigateur n'est pas équipé de géolocalisation.");

function initMap() {
  let options = {
    zoom: 13,
    center: userCoords,
  };
  let map = new google.maps.Map(document.getElementById("map"), options);

  // Add marker function
  const addMarker = (props) => {
    let marker = new google.maps.Marker({
      position: props.coords,
      map: map, // to what map: the above map
    });
    if (props.iconImage) marker.setIcon(props.iconImage);
    if (props.content) {
      let infoWindow = new google.maps.InfoWindow({
        content: props.content,
      });
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    }
  };

  addMarker({
    coords: userCoords,
    iconImage: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    content: "<h2>Yutz</h2>",
  });

  fetch("./restos.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((foodPlace) => {
        addMarker({
          coords: {
            lat: parseFloat(foodPlace.lat),
            lng: parseFloat(foodPlace.long),
          },
          content: `<h2>${foodPlace.restaurantName}</h2>`,
        });
        console.log(foodPlace);
      });
    })
    .catch((err) => console.log(err));
}
