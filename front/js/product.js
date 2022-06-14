// PAGE PRODUIT

//URL d'accès à l' API
let apiURL = 'http://localhost:3000/api';

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

// Récupération des données d'un canapé
async function getSingleProduct(canape_id) {
  let product = await fetch(apiURL + '/products/' + canape_id); 
  return await product.json();
  }

//Appel de la fonction avec le paramètre itemId, défini lorsqu'on a récupéré les paramètres de requête 
getSingleProduct(itemId)
  .then(product => {
    console.log(product);
    // Personnalisation des constantes créees via les éléments du code HTML
    itemImage[0].innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`; // [0] pour récupérer le 1er élément du tableau
    itemDescription.innerHTML = `${product.description}`;
    itemTitle.innerHTML = `<h1>${product.name}</h1>`;
    itemPrice.innerHTML = `${product.price}`;
    
    // Possibilité de 'formater' un nombre sous la forme monétaire en fonction de la devise et du pays avec la fonction NumberFormat 
    /** itemPrice.innerHTML = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.price); **/

    // Génération des options de la liste déroulante associée.
    let listeCouleurs = product.colors;
    // On vient ensuite parcourir chaque donnée du tableau avec la commande forEach
    // Cette commande renvoie une fonction, notée ci-dessous sous la formée fléchée simplifiée, avec comme paramètre de sortie la variable coloris
    listeCouleurs.forEach(coloris => {
      let optionLine = `<option value="${coloris}">${coloris}</option>`;
      itemColors.innerHTML += optionLine;
    });
  })  

  // Affichage des erreurs potentielles
  .catch((error) => {
    console.error('Erreur : ' + error)
  });

// Création de constantes pour les choix de l'utilisateur
const itemQuantity = document.getElementById("quantity");
const itemOptionColor = document.getElementById("colors");
const addToCart = document.getElementById("addToCart");

// Click + envoi au panier
addToCart.addEventListener("click", (event) => {
  event.preventDefault(); // => bloque le click event si les conditions ne sont pas au rdv:

  // La quantité du produit n'est pas respectée:
  if (
    itemQuantity.value <= 0 
    || // => vérifier si au moins une des deux conditions est vraie
    itemQuantity.value > 100
  ) {
  alert("Veuillez ajouter svp une quantité comprise entre 0 et 100");
  }
  // Si l'option de couleur n'a pas été selectionnée
  else if (itemOptionColor.value == "") {
  alert("Veuillez sélectionner svp une couleur disponible");
  } else {

// Récupération des valeurs utiles du produit sélectionné
  let selectedProduct = {
    name: itemTitle.textContent,
    id: itemId,
    price: itemPrice.textContent,
    color: itemOptionColor.value,
    quantity: itemQuantity.value,
  };

console.log(selectedProduct);

// Initialisation du localStorage au sein du bouton "ajouter au panier" afin de stocker les données
// Déclaration de la variable 
// JSON.parse convertit les données JSON du local storage en objet Javascript
  let productInLocalStorage = JSON.parse(localStorage.getItem("product")); 

// Déclaration fenêtre pop up pour diriger l'utilisateur vers la page panier ou la page d'accueil
const popupConfirmation =() =>{
  if(window.confirm(`|${itemTitle.textContent} a bien été ajouté au panier!
Cliquez sur OK pour valider votre panier ou sur ANNULER pour poursuivre vos achats.`)){
  window.location.href = "confirmation.html"
  }else{
    window.location.href = "index.html"
  }
}

// Vérification s'il y a déjà un produit enregistré dans le local storage ou 
// Ajout d'un autre produit avec .push
  if(productInLocalStorage){
    productInLocalStorage.push(selectedProduct);
    localStorage.setItem("product", JSON.stringify(productInLocalStorage))
    console.log(productInLocalStorage);
    popupConfirmation();
  }

// S'il n'y a pas de produit enregistré dans le local storage
// Enregistrement d'une clé et de sa valeur avec la méthode .setItem 
// Utilisation de la méthode JSON.stringify pour convertir l'objet Javascript en chaîne de caractères JSON
  else{
    productInLocalStorage =[];
    productInLocalStorage.push(selectedProduct);
    localStorage.setItem("product", JSON.stringify(productInLocalStorage))
  }
}})