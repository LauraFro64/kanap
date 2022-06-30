// PAGE PANIER

//Stockage des variables
let urlApi = 'http://localhost:3000/api';

// Variable pour stocker les Id de chaque articles présent dans le panier (utilisés pour créer la commande)
let products = [];

// Variable qui récupère l'orderId envoyé comme réponse par le serveur lors de la requête POST
let orderId = "";


// Récupération du contenu du panier dans le localStorage
function getCartFromLS() {
  // Conversion des données de la chaine de caractère JSON en objet javascript
  let cart = localStorage.getItem("product");
  // Si le localstorage est vide, il renvoie un tableau vide sinon 
  if (cart === null || cart === 0) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

//Enregistrement du contenu du panier dans le LocalStorage
const saveCartInLS = (cartContent) => {
  localStorage.setItem("product", JSON.stringify(cartContent)); 
}

//Récupération des infos d'un produit depuis l'API
async function getProductInfo(productId) {
  return fetch(`${urlApi}/products/${productId}`)
  .then(res =>  {return res.json()})
  .then(response => { return response}) 
  .catch((err) => { console.log("erreur",err) })
}

// Gestion de la modification des produits dans le panier
// "QuerySelectorAll" permet d'utiliser la fonction "forEach" car obtention d'une "node list' lue comme un []
const updateQuantity = () => {
  let itemsQuantity = document.querySelectorAll(".itemQuantity");
  itemsQuantity.forEach((itemQuantity) => {
    itemQuantity.addEventListener("change", (event) =>{
      event.preventDefault(); 
      //Récupération des éléments permettant la mise à jour du panier
      const inputValue = itemQuantity.value;
      // .closest permet de trouver le parent du sélecteur passé en paramètre, ici itemQuantity
      // .dataset permet de modifier immédiatement l'élément
      const dataId = itemQuantity.closest("article").dataset.id;
      const dataColor = itemQuantity.closest("article").dataset.color;
      //Récupération du contenu du LS
      let productsIncart = getCartFromLS();
      //Parcours du contenu 
      productsIncart.forEach((productIncart) => {
        if (productIncart.id == dataId && productIncart.color == dataColor){
          if (inputValue < 1 || inputValue > 100) {
            //Réinitialisation de la valeur du champ itemQuantity à sa valeur d'origine
            itemQuantity.value = productIncart.quantity;
            alert('Attention, quantité saisie invalide');
          } else {
            //Mise à jour du panier
            productIncart.quantity = inputValue;
            alert('Produit mis à jour');
          }
          }
      });
      //Mise à jour du LS 
      saveCartInLS(productsIncart);
      //Recalcul des totaux du panier
      cartTotals();
      });
    });
  };


// Calcul du nombre total de produits + prix total du panier
// Initialisation du panier en partant de 0
const cartTotals = () => {
  let productsQuantity = 0;
  let totalPriceCart = 0;
  let productsIncart = getCartFromLS();
  if (productsIncart.length == 0) {
    totalQuantity.innerHTML = productsQuantity;
    totalPrice.innerHTML = totalPriceCart;
  } else {
    // Création d'une fonction asynchrone sinon le montant total ne s'affiche pas 
    productsIncart.forEach(async (productIncart) => {
      // Mise en pause de la promesse afin que la fonction récupère les infos du produit depuis l'API
      const productInfo = await getProductInfo(productIncart.id);
      // ParseInt transforme l'élément en nombre entier
      productsQuantity += parseInt (productIncart.quantity);
      totalPriceCart += parseInt (productInfo.price) * parseInt (productIncart.quantity);
      totalQuantity.innerHTML = productsQuantity;
      totalPrice.innerHTML =totalPriceCart;
    });
  }
}

//Suppression d'un produit
const deleteProducts = () =>{
  //Récupération des liens de suppression des produits qu'on parcourt puis activation du click
  let deletedProductLinks = document.querySelectorAll(".deleteItem");
  deletedProductLinks.forEach ((deletedProductLink) =>{
    deletedProductLink.addEventListener("click", (event) => {
      // .closest permet de trouver le parent du sélecteur passé en paramètre, ici deletedProductLink
      // .dataset permet de modifier immédiatement l'élément
      let deleteId = deletedProductLink.closest("article").dataset.id;
      let deleteColor = deletedProductLink.closest("article").dataset.color;

      //Récupération des infos du panier
      let productsInCart = getCartFromLS();
      // La méthode filter va prendre en argument une fonction dans laquelle il y a une condition. 
      //Pour que l'élément soit conservé dans le tableau de sortie il faudra que cette condition soit vraie.
      productsInCart = productsInCart.filter(
        (element) => !(element.id == deleteId && element.color == deleteColor) // "!" = différent de
      );
      // Mise à jour du LS avec les produits restants
      saveCartInLS(productsInCart);

      // Confirmation de la suppression du produit
      alert("Votre article a bien été supprimé du panier !");

      // Rechargement de la page pour actualiser le contenu du panier
      displayCart();  
  });
});
};

// Affichage du panier
function displayCart() {
  //Nettoyage au préalable ce que contient le conteneur du panier
  cart__items.innerHTML = "";
  //Récupération du contenu du panier depuis le LS
  let productsInCart = getCartFromLS();
  //Affichage d'un message si le panier est vide
  if (productsInCart.length == 0) {
    cart__items.innerHTML +=
      '<p> Votre panier est vide ! </p>';
  } else {
    //Parcours du LS, renvoyant une fonction asynchrone qui va appeler via un await les infos du produit
    //ProductInfo ne contient plus une promesse, mais bien le tableau des infos du produit.
    productsInCart.forEach(async (productInCart) => {
      const productInfo = await getProductInfo(productInCart.id);
      //Création d'un élément article dans le panier
      productsCart = `<article class="cart__item" data-id="${productInCart.id}" data-color="${productInCart.color}">         
                    <div class="cart__item__img">
                        <img src="${productInfo.imageUrl}" alt="${productInfo.altText}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__titlePrice">
                            <h2>${productInfo.name}</h2>
                            <p>${productInCart.color}</p>
                            <p>${productInfo.price} €</p>
                        </div>          
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInCart.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>`;

      cart__items.innerHTML += productsCart;
      //Activation des boutons de mise à jour des quantités dans le panier
      updateQuantity();
      //Activation des boutons de suppression dans le panier
      deleteProducts();
     
    });
  }
  //Calcul des totaux du panier
  cartTotals();
}
//et enfin, on lance l'affichage du panier !
displayCart();


// GESTION DU FORMULAIRE
formOrder = () => { // Déclaration d'une fonction fléchée simplifiée
  const order = document.getElementById("order");

  order.addEventListener("click", (event) => {
    event.preventDefault();

    //Récupération des données du formulaire dans un objet
    const formData = {
      firstName: document.getElementById("firstName").value, // "," et non ";" car c'est un objet
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city:  document.getElementById("city").value,
      email: document.getElementById("email").value
    };

     // Création d'une variable pour éviter de répéter le code pour le prénom, nom et ville
    // Regex pour le contrôle des champs Prénom, Nom et Ville
  const regExPrenomNomVille = (value) => {
  // Utilisation des expressions rationnelles 
  // Motifs utilisés pour correspondre à certaines combinaisons de caractères au sein de chaînes de caractères)
    return /^[A-Z][A-Za-z\é\è\ê\-]+$/.test(value);
  };

  // Regex pour le contrôle du champ Adresse
  const regExAdresse = (value) => {
    return /^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$/.test(value);
  };

  // Regex pour le contrôle du champ Email
  const regExEmail = (value) => {
    return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(
      value
    );
  };

  // Fonction de contrôle du champ Prénom:
  function firstNameControl() { // => il s'agit d'une "fonction expression" rédigée au milieu d'une expression
    const prenom = formData.firstName;
    let inputFirstName = document.querySelector("#firstName");
    if (regExPrenomNomVille(prenom)) {
      inputFirstName.style.backgroundColor = "green";

      document.querySelector("#firstNameErrorMsg").textContent = "";
      return true;
    } else {
      inputFirstName.style.backgroundColor = "#FF6F61";

      document.querySelector("#firstNameErrorMsg").textContent =
        "Champ invalide, ex: Laura";
      return false;
    }
  }

  // Fonctions de contrôle du champ Nom:
  function lastNameControl() {
    const nom = formData.lastName;
    let inputLastName = document.querySelector("#lastName");
    if (regExPrenomNomVille(nom)) {
      inputLastName.style.backgroundColor = "green";

      document.querySelector("#lastNameErrorMsg").textContent = "";
      return true;
    } else {
      inputLastName.style.backgroundColor = "#FF6F61";

      document.querySelector("#lastNameErrorMsg").textContent =
        "Champ invalide, ex: Fromentin";
      return false;
    }
  }

  // Fonctions de contrôle du champ Adresse:
  function addressControl() {
    const adresse = formData.address;
    let inputAddress = document.querySelector("#address");
    if (regExAdresse(adresse)) {
      inputAddress.style.backgroundColor = "green";

      document.querySelector("#addressErrorMsg").textContent = "";
      return true;
    } else {
      inputAddress.style.backgroundColor = "#FF6F61";

      document.querySelector("#addressErrorMsg").textContent =
        "Champ invalide, ex: 3 rue des Tournesols";
      return false;
    }
  }

  // Fonctions de contrôle du champ Ville:
  function cityControl() {
    const ville = formData.city;
    let inputCity = document.querySelector("#city");
    if (regExPrenomNomVille(ville)) {
      inputCity.style.backgroundColor = "green";

      document.querySelector("#cityErrorMsg").textContent = "";
      return true;
    } else {
      inputCity.style.backgroundColor = "#FF6F61";

      document.querySelector("#cityErrorMsg").textContent =
        "Champ invalide, ex: Bayonne";
      return false;
    }
  }

  // Fonctions de contrôle du champ Email:
  function mailControl() {
    const courriel = formData.email;
    let inputMail = document.querySelector("#email");
    if (regExEmail(courriel)) {
      inputMail.style.backgroundColor = "green";

      document.querySelector("#emailErrorMsg").textContent = "";
      return true;
    } else {
      inputMail.style.backgroundColor = "#FF6F61";

      document.querySelector("#emailErrorMsg").textContent =
        "Champ invalide, ex: example@formData.fr";
      return false;
    }
  }

 // Contrôle validité formulaire avant de l'envoyer dans le local storage
  if (
  firstNameControl() &&
  lastNameControl() &&
  addressControl() &&
  cityControl() &&
  mailControl()
  ) {
    
  // Enregistrement du formulaire dans le local storage
  localStorage.setItem("formData", JSON.stringify(formData));
  document.querySelector("#order").value =
    "Cliquez pour confirmer et passer commande !";
    sendToServer ();
} else {
  error("Veuillez bien remplir le formulaire");
}


// REQUÊTE DU SERVEUR ET ENVOI DES DONNEES SUR LE SERVEUR
// avec FETCH et la méthode POST https://www.youtube.com/watch?v=m1IfaqFBgX8

/* REQUÊTE DU SERVEUR ET POST DES DONNÉES */
function sendToServer() {
  const sendToServer = fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify({ formData, products }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    // Récupération et stockage de la réponse de l'API (orderId)
    .then((response) => {
      return response.json();
    })
    .then((server) => {
      orderId = server.orderId;
      console.log(orderId);
    });

  // Si l'orderId a bien été récupéré, on redirige l'utilisateur vers la page de Confirmation
  if (orderId != "") {
    location.href = "confirmation.html?id=" + orderId;
  }
}
});
}
formOrder ();