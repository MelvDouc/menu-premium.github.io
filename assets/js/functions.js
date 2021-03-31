class FoodPlaceCard {
  constructor(
    name,
    streetAddress,
    zipCode,
    averageRatings,
    customerComments = []
  ) {
    this.customerComments = customerComments;

    let div = document.createElement("div");
    div.classList.add("food-place");

    let h2 = document.createElement("h2");
    h2.textContent = name;

    let fullAddress = document.createElement("address");
    let streetAddressParagraph = document.createElement("p");
    streetAddressParagraph.textContent = streetAddress;
    let zipCodeParagraph = document.createElement("p");
    zipCodeParagraph.textContent = zipCode;
    fullAddress.append(streetAddressParagraph, zipCodeParagraph);

    let reviews = document.createElement("div");
    reviews.classList.add("reviews");
    let starsDiv = document.createElement("div");
    starsDiv.textContent = averageRatings;
    let commentDiv = document.createElement("div");
    // for (let comment of customerComments) commentDiv.textContent += comment;
    commentDiv.textContent = this.customerComments.join();
    reviews.append(starsDiv, commentDiv);

    div.append(h2, fullAddress, reviews);

    return div;
  }
}

foodPlaces.forEach((foodPlace) => {
  let name = foodPlace.restaurantName;
  let streetAddress = foodPlace.address.split(",")[0];
  let zipCode = foodPlace.address.split(",")[1].trim();

  let averageRatings = 0;
  foodPlace.ratings.forEach((item) => (averageRatings += item.stars));
  averageRatings /= foodPlace.ratings.length;

  let comments = foodPlace.ratings.map((item) => item.comment);

  let foodPlaceCard = new FoodPlaceCard(
    name,
    streetAddress,
    zipCode,
    averageRatings,
    comments
  );
  document.getElementById("food-places").append(foodPlaceCard);
});
