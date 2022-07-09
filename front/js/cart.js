// PAGE PANIER

//Stockage des variables
let urlApi = 'http://localhost:3000/api';

// Variable pour stocker les Id de chaque article présent dans le panier (utilisés pour créer la commande)
let products = [];



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

// Modification des produits dans le panier
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
    // Regex (expressions régulières) pour le contrôle des champs Prénom, Nom et Ville
    const regExPrenomNomVille = (value) => {
    // Le ^ indique que la chaîne de caractères doit commencer par ce qui est marqué après.
    // Le $ indique que la chaîne de caractères doit se terminer par ce qui est marqué avant.
      return /^[A-Za-z\é\è\ê\-]+$/.test(value); 
      };

    // Regex pour le contrôle du champ Adresse
    const regExAdresse = (value) => {
      return /^[a-zA-Z0-9.,-_ ]{3,}$/.test(value);
    };

    // Regex pour le contrôle du champ Email
    const regExEmail = (value) => {
      return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,10})$/.test(value);
    };

    // Variables pour la validation ou non des valeurs inscrites par l'utilisateur
    let colorValid = "#00FF00";
    let colorInvalid = "#FF0000";

    // Fonction de contrôle du champ Prénom:
    function firstNameControl() { // => il s'agit d'une "fonction expression" rédigée au milieu d'une expression
      const prenom = formData.firstName;
      let inputFirstName = document.querySelector("#firstName");
      if (regExPrenomNomVille(prenom)) {
        inputFirstName.style.backgroundColor = colorValid;

        document.querySelector("#firstNameErrorMsg").textContent = "";
        return true;
      } else {
        inputFirstName.style.backgroundColor = colorInvalid;

        document.querySelector("#firstNameErrorMsg").textContent =
          "Champ invalide, ex: Laura";
        return false;
      }
    }


    // Fonction de contrôle du champ Nom:
    function lastNameControl() {
      const nom = formData.lastName;
      let inputLastName = document.querySelector("#lastName");
      if (regExPrenomNomVille(nom)) {
        inputLastName.style.backgroundColor = colorValid;

        document.querySelector("#lastNameErrorMsg").textContent = "";
        return true;
      } else {
        inputLastName.style.backgroundColor = colorInvalid;

        document.querySelector("#lastNameErrorMsg").textContent =
          "Champ invalide, ex: Fromentin";
        return false;
      }
    }

    // Fonction de contrôle du champ Adresse:
    function addressControl() {
      const adresse = formData.address;
      let inputAddress = document.querySelector("#address");
      if (regExAdresse(adresse)) {
        inputAddress.style.backgroundColor = colorValid;

        document.querySelector("#addressErrorMsg").textContent = "";
        return true;
      } else {
        inputAddress.style.backgroundColor = colorInvalid;

        document.querySelector("#addressErrorMsg").textContent =
          "Champ invalide, ex: 3 rue des Tournesols";
        return false;
      }
    }

    // Fonction de contrôle du champ Ville:
    function cityControl() {
      const ville = formData.city;
      let inputCity = document.querySelector("#city");
      if (regExPrenomNomVille(ville)) {
        inputCity.style.backgroundColor = colorValid;

        document.querySelector("#cityErrorMsg").textContent = "";
        return true;
      } else {
        inputCity.style.backgroundColor = colorInvalid;

        document.querySelector("#cityErrorMsg").textContent =
          "Champ invalide, ex: Bayonne";
        return false;
      }
    }

    // Fonction de contrôle du champ Email:
    function mailControl() {
      const courriel = formData.email;
      let inputMail = document.querySelector("#email");
      if (regExEmail(courriel)) {
        inputMail.style.backgroundColor = colorValid;

        document.querySelector("#emailErrorMsg").textContent = "";
        return true;
      } else {
        inputMail.style.backgroundColor = colorInvalid;

        document.querySelector("#emailErrorMsg").textContent =
          "Champ invalide, ex: example@live.fr";
        return false;
      }
    }

  // Contrôle validité formulaire avant de l'envoyer dans le local storage
  formCheck = () => {
    if (
    firstNameControl() &&
    lastNameControl() &&
    addressControl() &&
    cityControl() &&
    mailControl()
    ) {
      
  // Enregistrement du formulaire dans le local storage
  return true;

} else {
  alert("Une erreur est survenue, merci de vérifier vos informations");
}
};

formCheck();

// Récupération des données du formulaire et des produits dans un objet
orderDetails =  {
  contact : formData,
  products : products
}

// Envoi des données du formulaire et des produits au serveur avec la méthode POST
const checkOut = {
  method: "POST",
  body: JSON.stringify(orderDetails),
  headers: {
    "Content-Type": "application/json",
  },
};

fetch("http://localhost:3000/api/products/order", checkOut)
  .then((response) => response.json())
  .then((data) => {
    
    // localStorage.setItem("orderId", data.orderId);
    
    if (formCheck()) {
      document.location.href = `confirmation.html?orderId=${data.orderId}`;   
    }
  });
}); // addeventlistener fin
};

formOrder();