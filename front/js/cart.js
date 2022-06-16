// PAGE PANIER

// Récupération des produits dans le local storage
let products= [];

// Conversion des données de la chaine de caractère JSON en objet javascript
let productInLocalStorage = JSON.parse(localStorage.getItem("product")); 

console.log(productInLocalStorage)

// Si le panier est vide
if (productInLocalStorage === null || productInLocalStorage === 0) {

    // Incrémentation du code HTML pour l'affichage du panier vide
    document.getElementById("cart__items").innerHTML = 
        `<div class="cart__empty">
        <p> Désolé votre panier est vide ! </p>
        </div>`;
  } else {
  
    // Si le panier n'est pas vide, on affiche les produits sous forme d'un tableau dans le local storage
    let productsCart = [];
    
    // Boucle avec for qui déclare une variable en incrémentant i à chaque itération
    for (i = 0; i < productInLocalStorage.length; i++) {
  
    // Incrémentation du code à chaque tour de boucle pour chaque produit qui a été ajouté au panier
    // Concaténation pour que le produit s'ajoute au tableau productsCart sans écraser le précédent 
    productsCart = productsCart + 
        `<article class="cart__item" data-id="${productInLocalStorage[i].id}" data-color="${productInLocalStorage.color}">         
              <div class="cart__item__img">
                  <img src="${productInLocalStorage[i].imageUrl}" alt="${productInLocalStorage[i].altTxt}">
              </div>
              <div class="cart__item__content">
                  <div class="cart__item__content__titlePrice">
                      <h2>${productInLocalStorage[i].name}</h2>
                      <p>${productInLocalStorage[i].color}</p>
                      <p>${productInLocalStorage[i].price} €</p>
                  </div>          
                  <div class="cart__item__content__settings">
                      <div class="cart__item__content__settings__quantity">
                          <p>Qté : </p>
                          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLocalStorage[i].quantity}">
                      </div>
                      <div class="cart__item__content__settings__delete">
                          <p class="deleteItem">Supprimer</p>
                      </div>
                  </div>
              </div>
          </article>`;
    }
// Affichage réussie grâce à cette astuce trouvée dans cette vidéo https://www.youtube.com/watch?v=VDV6PL0AXd4
    if (i === productInLocalStorage.length){
        // Injection du code HTML et affichage sur la page panier
        const cartItems = document.getElementById("cart__items"); 
        cartItems.innerHTML += productsCart;
    }}

// Ajout d'un produit sélectionné dans le local storage
const addProductInLocalStorage = () => {
    // Ajout dans le tableau de l'objet avec les values choisies par l'utilisateur
    productInLocalStorage.push(productsCart);

    // Transformation en format JSON et l'envoyer dans la key "product" du localstorage
    localStorage.setItem("product",JSON.stringify(addProductInLocalStorage))
}

// Si le produit est envoyé dans le local storage
    /** if (productInLocalStorage) { 
  
      // Pour chaque produit ajouté
      productInLocalStorage.forEach(function (productAdd) {

// Si le produit ajouté possède un 'id' et une option 'color' identique: la quantité est mise à jour
    if (productAdd.id == itemId && productAdd.color == itemOptions.value(""){}**/


/** GESTION DU BOUTONN SUPPRIMER **/
let btn_supprimer = document.getElementsByClassName("deleteItem");
console.log(btn_supprimer)

for (let l = 0; l < btn_supprimer.length; l++){
    btn_supprimer[l].addEventListener("click" , (event) =>{
        event.preventDefault(); // => évite le rechargement de la page

// Sélection de l'ID de l'article à supprimer 
let id_selection_supp = productInLocalStorage[l].id_productsCart

// Utilisation de la méthode filter qui retourne un nouveau tableau contenant tous les éléments du tableau d'origine qui remplissent une condition déterminée par la fonction callback
productInLocalStorage = productInLocalStorage.filter( element => element.id_productsCart !== id_selection_supp); // ! => effet inverse

// Transformation en format JSON et l'envoyer dans la key "product" du localstorage
localStorage.setItem("product",JSON.stringify(addProductInLocalStorage))

// Création d'une alerte
alert("Cet article a bien été supprimé de votre panier");
window.location.href ="cart.html"

})
}

