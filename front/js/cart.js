// PAGE PANIER

// Récupération des produits dans le local storage
let products= [];

// Conversion des données de la chaine de caractère JSON en objet javascript
let productInLocalStorage = JSON.parse(localStorage.getItem("product")); 

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
                  <img src="${productInLocalStorage[i].imageURL}" alt="${productInLocalStorage[i].alt}">
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