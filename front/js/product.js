
// PAGE PRODUIT

// Récupération du produit => ".search" pointe la partie de l'URL qui suit le symbol ?
let params = new URLSearchParams(window.location.search); 

// qu'on récupère ici avec .get qu'on déclare dans une variable
let itemId = params.get("id");

// Initialisation des caractéristiques du produit
const itemImage = document.getElementsByClassName("item__img");
const itemTitle = document.getElementById("title");
const itemPrice = document.getElementById("price");
const itemDescription = document.getElementById("description");
const itemColors = document.getElementById("colors"); 

// Ajout d'un string vide pour l'affichage de l'image sur la page
let imageURL = ""; 

// Requête pour récupérer le produit dans la base de données
// Rajout de 'itemId' déclaré précédemment pour cibler et avoir le produit selectionné
fetch(`http://localhost:3000/api/products/${itemId}`)
  .then((response) => response.json()) 
  .then((data) => {

console.log(data);

// Implémentation des éléments de la page dans le code HTML
    itemImage[0].innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`; // [0] pour récupérer le 1er élément du tableau
    imageURL = data.imageUrl;

    itemTitle.innerHTML = `<h3>${data.name}</h3>`;
    itemPrice.innerHTML = `${data.price}`;
    itemDescription.innerHTML = `${data.description}`;


  })
  
  // Affichage des erreurs potentielles
  .catch((error) => {
    alert("Error");
  });