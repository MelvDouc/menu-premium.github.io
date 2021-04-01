// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

// ====================
// Récupérer la clé API Google cachée dans le fichier .env et insérer le script correspondant
// ====================
fetch("./.env")
  .then((res) => res.text())
  .then((data) => {
    let API_script = document.createElement("script");
    API_script.src = `https://maps.googleapis.com/maps/api/js?key=${data}&callback=initMap&libraries=&v=weekly`;
    API_script.async = true;
    document.body.appendChild(API_script);
  });

// ====================
// Créer une classe pour insérer les restaurants à côté de la carte
// ====================

class FoodPlaceCard {
  constructor(
    name,
    streetAddress,
    zipCode,
    averageRatings,
    customerComments = []
  ) {
    this.name = name;
    this.streetAddress = streetAddress;
    this.zipCode = zipCode;
    this.averageRatings = averageRatings;
    this.customerComments = customerComments;

    let div = document.createElement("div");
    div.classList.add("food-place");

    let h2 = document.createElement("h2");
    h2.textContent = this.name;

    let fullAddress = document.createElement("address");
    let streetAddressParagraph = document.createElement("p");
    streetAddressParagraph.textContent = this.streetAddress;
    let zipCodeParagraph = document.createElement("p");
    zipCodeParagraph.textContent = this.zipCode;
    fullAddress.append(streetAddressParagraph, zipCodeParagraph);

    let reviews = document.createElement("div");
    reviews.classList.add("reviews");
    let starsDiv = document.createElement("div");
    starsDiv.classList.add("stars");
    starsDiv.textContent = this.averageRatings;
    let commentUl = document.createElement("ul");
    commentUl.classList.add("comments");
    this.customerComments.forEach((comm) => {
      let li = document.createElement("li");
      li.textContent = comm;
      commentUl.append(li);
    });
    reviews.append(starsDiv, commentUl);

    div.append(h2, fullAddress, reviews);

    return div;
  }
}

// ====================
// Obtenir les coordonnées de l'utilisateur
// ====================

let userCoords;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    userCoords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  });
} else alert("Votre navigateur n'est pas équipé de géolocalisation.");

// ====================
// Insérer les infos utiles restaurants au moyen de la classe et les stocker dans une variable
// ====================

let foodPlaces = [];

fetch("./restos.json")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((foodPlace) => {
      foodPlaces.push(foodPlace);
      let streetAddress = foodPlace.address.split(",")[0];
      let zipCode = foodPlace.address.split(",")[1].trim();

      let averageRatings =
        foodPlace.ratings.reduce((a, obj) => a + obj.stars, 0) /
        foodPlace.ratings.length;

      let comments = foodPlace.ratings.map((item) => item.comment);

      let foodPlaceCard = new FoodPlaceCard(
        foodPlace.restaurantName,
        streetAddress,
        zipCode,
        averageRatings,
        comments
      );
      document.getElementById("food-places").append(foodPlaceCard);
    });
  });

// ====================
// Fonction de gestion de la carte
// ====================

function initMap() {
  let options = {
    zoom: 5,
    center: userCoords,
  };
  let map = new google.maps.Map(document.getElementById("map"), options);

  // Fonction de marqueur
  const addMarker = (props) => {
    let marker = new google.maps.Marker({
      position: props.coords,
      map: map, // quelle carte?: la carte ci-dessus
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
    content: "<h2>Vous êtes ici.</h2>",
  });

  foodPlaces.forEach((foodPlace) => {
    let address = foodPlace.address.split(",");
    addMarker({
      coords: {
        lat: parseFloat(foodPlace.lat),
        lng: parseFloat(foodPlace.long),
      },
      content: `
      <h2>${foodPlace.restaurantName}</h2>
      <address>
        <p>${address[0]}</p>
        <p>${address[1].trim()}</p>
      </address>
      `,
    });
  });
}
