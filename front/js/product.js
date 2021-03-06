/** PAGE PRODUIT **/

// URL d'accès à l' API
let apiURL = "http://localhost:3000/api";

// Récupération des paramètres de requête du produit => ".search" pointe la partie de l'URL qui suit le symbol ?
let params = new URLSearchParams(window.location.search);

// qu'on récupère ici avec .get qu'on déclare dans une variable
let itemId = params.get("id");

// Récupération des éléments HTML et les intégrer dans des constantes
const itemImage = document.getElementsByClassName("item__img");
const itemTitle = document.getElementById("title");
const itemPrice = document.getElementById("price");
const itemDescription = document.getElementById("description");
const itemColors = document.getElementById("colors");

// Ajout d'un string vide pour l'affichage de l'image sur la page
let imageUrl = "";

// Requête pour récupérer le produit dans la base de données
// Rajout de 'itemId' déclaré précédemment pour cibler et avoir le produit selectionné
async function getProducts() {
  let products = await fetch(`http://localhost:3000/api/products/${itemId}`);
  console.log(products);
  return products.json();
}
getProducts()
  .then(function (data) {
    // Personnalisation des constantes créees via les éléments du code HTML
    itemImage[0].innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`; // [0] pour récupérer le 1er élément du tableau
    imageUrl = data.imageUrl;
    itemDescription.innerHTML = `${data.description}`;
    itemTitle.innerHTML = `<h1>${data.name}</h1>`;
    itemPrice.innerHTML = `${data.price}`;

    // Possibilité de 'formater' un nombre sous la forme monétaire en fonction de la devise et du pays avec la fonction NumberFormat
    /** itemPrice.innerHTML = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.price); **/

    // Génération des options de la liste déroulante associée.
    let listeCouleurs = data.colors;
    // On vient ensuite parcourir chaque donnée du tableau avec la commande forEach
    // Cette commande renvoie une fonction, notée ci-dessous sous la formée fléchée simplifiée, avec comme paramètre de sortie la variable coloris
    listeCouleurs.forEach((coloris) => {
      let optionLine = `<option value="${coloris}">${coloris}</option>`;
      itemColors.innerHTML += optionLine;
    });
  })

  // Affichage des erreurs potentielles
  .catch((error) => {
    console.error("Erreur : " + error);
  });

// Création de constantes pour les choix de l'utilisateur
const itemQuantity = document.getElementById("quantity");
const itemOptionColor = document.getElementById("colors");
const addToCart = document.getElementById("addToCart");

// Click + ajout au panier
addToCart.addEventListener("click", (event) => {
  event.preventDefault(); // => bloque le click event si les conditions ne sont pas au rdv:

  // La quantité du produit n'est pas respectée:
  if (
    itemQuantity.value <= 0 || // => vérifier si au moins une des deux conditions est vraie
    itemQuantity.value > 100
  ) {
    alert("Veuillez svp, ajouter une quantité comprise entre 1 et 100.");
  }
  // Si l'option de couleur n'a pas été sélectionnée
  else if (itemOptionColor.value == "") {
    alert("Veuillez svp, sélectionner une couleur disponible.");
  } else {
    // Récupération des valeurs utiles du produit sélectionné
    let selectedProduct = {
      id: itemId,
      color: itemOptionColor.value,
      quantity: itemQuantity.value,
      // name: itemTitle.textContent,
      //image: imageUrl,
      // price: itemPrice.textContent,
    };

    // Initialisation du localStorage au sein du bouton "ajouter au panier" afin de stocker les données
    // Déclaration de la variable
    // JSON.parse convertit les données JSON du local storage en objet Javascript
    let productInLocalStorage = JSON.parse(localStorage.getItem("product"));
    if (productInLocalStorage == null) {
      productInLocalStorage = []; // => pour que .find fonctionne
    }
    // Déclaration fenêtre pop up pour diriger l'utilisateur vers la page panier ou la page d'accueil
    const popupConfirmation = () => {
      if (
        window.confirm(`${itemTitle.textContent} a bien été ajouté au panier!
Cliquez sur OK pour valider votre panier ou sur ANNULER pour poursuivre vos achats.`)
      ) {
        window.location.href = "cart.html";
      } else {
        window.location.href = "index.html";
      }
    };

    // Vérification si un produit similaire avec même id et même couleur est présent
    productFound = productInLocalStorage.find(
      // => fonctionne uniquement sur un tableau
      (p) => p.id == selectedProduct.id && p.color == selectedProduct.color
    );

    let addInCart = 0;

    // Condition pour vérifier l'existance d'un produit avec la méthode inverse
    if (productFound != undefined) {
      newQuantity =
        parseInt(productFound.quantity) + parseInt(selectedProduct.quantity);
      if (newQuantity > 100) {
        alert(
          "Produit déjà existant dans le panier, quantité supérieure à 100. Merci de modifier votre sélection."
        );
      } else {
        // Si oui, augmentation de sa quantité
        productFound.quantity =
          parseInt(productFound.quantity) + parseInt(selectedProduct.quantity);
          addInCart = 1;
      }
    } else {
      productInLocalStorage.push(selectedProduct);
      addInCart = 1;
    }

    if (addInCart == 1 ) {
    localStorage.setItem("product", JSON.stringify(productInLocalStorage));
    popupConfirmation();
    }
  }
});
