// PAGE PANIER

// Récupération des produits dans le local storage
let products= [];

// Conversion des données de la chaine de caractère JSON en objet javascript
let productInLocalStorage = JSON.parse(localStorage.getItem("product")); 

// Si le panier est vide
if (productInLocalStorage === null || productInLocalStorage == 0) { // on met "== 0" et non "=== 0" sinon ça ne fonctionne pas

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
        // La méthode .push() récupère uniquement l'id de chaque produit dans "le array products"
        products.push(productInLocalStorage[i].id); 
  
    // Incrémentation du code à chaque tour de boucle pour chaque produit qui a été ajouté au panier
    // Concaténation pour que le produit s'ajoute au tableau productsCart sans écraser le précédent 
    productsCart = productsCart + 
        `<article class="cart__item" data-id="${productInLocalStorage[i].id}" data-color="${productInLocalStorage.color}">         
              <div class="cart__item__img">
                  <img src="${productInLocalStorage[i].image}" alt="${productInLocalStorage[i].alt}">
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


// MODIFICATION DE LA QUANTITE DU PRODUIT DIRECTEMENT DEPUIS LE PANIER
// Déclaration d'une fonction fléchée qui engendre une variable dans laquelle on récupère l'élément HTML utile
changeQuantity = () => {
    let itemQuantity = document.getElementsByClassName("itemQuantity");

    // Utilisation de la méthode addEventListener type "change"
    for (let j = 0; j < itemQuantity.length; j++) {
      itemQuantity[j].addEventListener("change", (event) => {
        event.preventDefault();

        // Initialisation d'un nouveau tableau avec la nouvelle quantité
        let itemNewQuantity = itemQuantity[j].value;
        
        const newLocalStorage = {
          id: productInLocalStorage[j].id,
          image: productInLocalStorage[j].image,
          alt: productInLocalStorage[j].alt,
          name: productInLocalStorage[j].name,
          color: productInLocalStorage[j].color,
          price: productInLocalStorage[j].price,
          quantity: itemNewQuantity,
        };

        // Intégration des nouvelles valeurs dans le local storage
        productInLocalStorage[j] = newLocalStorage;
        localStorage.setItem("product", JSON.stringify(productInLocalStorage));

        // Pop-up de la mise à jour du panier
        alert("Votre panier a bien été mis à jour !");

        // Rechargement de la page pour actualiser le contenu du panier
      window.location.href = "cart.html"; 

      });
    }
  };

// Appel de la fonction
changeQuantity();


//SUPPRESSION D'UN ARTICLE DU PANIER
// Déclaration d'une fonction fléchée qui engendre une variable dans laquelle on récupère l'élément HTML utile
deleteProductOfCart = () => {
  const deleteProduct = document.getElementsByClassName("deleteItem");

  for (let k = 0; k < deleteProduct.length; k++) {
    deleteProduct[k].addEventListener("click", (event) => {
      event.preventDefault();

      // Enregistrement de l'id et de la couleur sélectionnés par le bouton supprimer
      let deleteId = productInLocalStorage[k].id;
      let deleteColor = productInLocalStorage[k].color;

      // Sélection des éléments à garder avec la méthode .filter 
      // Suppression de l'élément cliqué avec la logique inversée "!=="
      productInLocalStorage = productInLocalStorage.filter(
        (element) => element.id !== deleteId || element.color !== deleteColor
      );

      // Mise à jour du local storage avec les produits restants
      // Traduction de l'objet javascript en chaine de caractère JSON
      localStorage.setItem("product", JSON.stringify(productInLocalStorage)); 

      // Confirmation de la suppression du produit
      alert("Votre article a bien été supprimé de votre panier !");

      // Rechargement de la page pour actualiser le contenu du panier
      window.location.href = "cart.html"; 
      });
    }
  };

// Appel de la fonction
deleteProductOfCart();


// CALCUL AUTOMATIQUE DU MONTANT TOTAL DU PANIER
// Déclaration d'une fonction fléchée simplifiée
cartTotal =() => {

  // Récupération dans un tableau, des prix relatifs aux produits enregistrés dans le panier 
  const priceProductsInCart =[];

  //Création d'une boucle pour aller chercher ces prix 
  for (l = 0; l < productInLocalStorage.length; l++){
        
    // Création d'une variable pour intégrer ces prix
    let PriceTotal =

    // Calcul du prix par la quantité
    productInLocalStorage[l].price * productInLocalStorage[l].quantity; 
    priceProductsInCart.push(PriceTotal);

    // Addition des prix avec la méthode "reduce" qui garde en mémoire, à chaque calcul, les résultats de l'opération en cumulant la somme précédente
    const reducer = (accumulator, currentValue) => accumulator + currentValue; // en paramètre un accumulateur => valeur précédente et la valeur courante
    montantTotal = priceProductsInCart.reduce(reducer,0); // obligation de mettre une valeur initiale 0 sinon erreur

    // Intégration du code HTML du prix total à afficher
    const totalPrice = document.getElementById("totalPrice");
    totalPrice.textContent = montantTotal;
    
    }
    };

// Appel de la fonction
cartTotal();

// AFFICHAGE DU NOMBRE TOTAL D'ARTICLES DANS LE PANIER
totalArticles = () => {
  let totalItems = 0;
  for (e in productInLocalStorage) {

    // Analyse et converti la valeur 'quantity' dans le localstorage en une chaîne, et renvoie un entier (parseInteger), sur la base décimale de 10 
    // Transforme la donnée string en donnée number
    const newQuantity = parseInt(productInLocalStorage[e].quantity, 10);

    // Attribue la valeur retournée par parseInt à la variable totalItems
    totalItems += newQuantity;
  }

  // Attribue à totalQuantity la valeur de totalItems et l'afficher dans le DOM
  const totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.textContent = totalItems; 

  };

totalArticles();


// GESTION DU FORMULAIRE
// Déclaration d'une fonction fléchée simplifiée
formOrder = () => {
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

    // Contrôle des informations saisies dans le formulaire
    // Création d'une variable pour éviter de répéter le code pour le prénom, nom et ville
    const regExFirstAndLastNameAndCity = (value) => {
      return /^[A-Za-z]{2,20}$/.test(value);
    };
    
    // Contrôle du prénom
    function controlFirstName(){ // => il s'agit d'une "fonction expression" rédigée au milieu d'une expression
      // Utilisation des expressions rationnelles (= motifs utilisées pour correspondre à certaines combinaisons de caractères au sein de chaînes de caractères)
      const validFirstName = formData.firstName;
      if(regExFirstAndLastNameAndCity(validFirstName)){ // méthode Regex, ici pas de symbole spécial et nbre de caractères limité entre 2 et 20
        return true;
      } else {
      let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
      firstNameErrorMsg.innerHTML = "Prénom invalide";
      }
    };

    // Contrôle du nom
    function controlLastName(){
      const validLastName = formData.lastName;
      if(regExFirstAndLastNameAndCity(validLastName)){
        return true;
      } else {
        let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
          lastNameErrorMsg.innerHTML = "Nom invalide";
        }
      };

      // Contrôle de l'adresse
      function controlAddress(){
        const validAddress = formData.address;
        if (/^[a-zA-Z0-9\s-]{2,50}$/.test(validAddress)) {
          return true;
        } else {
          let addressErrorMsg = document.getElementById("addressErrorMsg");
          addressErrorMsg.innerHTML = "Adresse invalide";
        }
      };

      // Contrôle de la ville
      function controlCity(){
        const validCity = formData.city;
        if (regExFirstAndLastNameAndCity(validCity)) {
          return true;
        } else {
          let cityErrorMsg = document.getElementById("cityErrorMsg");
          cityErrorMsg.innerHTML = "Ville invalide";
        }
      };

      // Contrôle de l'email
      function controlEmail(){
        const validEmail = formData.email;
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(validEmail)) {
          return true;
        } else {
          let emailErrorMsg = document.getElementById("emailErrorMsg");
          emailErrorMsg.innerHTML = "Mail invalide";
        }
      };

      // Vérification des informations récupérées
      formControl = () => {
        if (
          controlFirstName() &&
          controlLastName() &&
          controlAddress() &&
          controlCity() &&
          controlEmail()
        ) {
          // Envoi des informations dans le local storage
          //localStorage.setItem("formData", JSON.stringify(formData)); // 
          // Méthode booléan
          return true;

        } else {
          alert("Une erreur est survenue, merci de vérifier vos informations");
        }
      };

// Appel de la fonction
formControl();

// Récupération des données du formulaires et des produits dans un objet
const cartData ={
  formData,
  products,
};

// Envoi de l'objet cartData vers le serveur avec la méthode POST
const sendCart = {
  method: "POST",
  body: JSON.stringify(cartData),
  headers: {
    "Content-Type": "application/json",
  },
};

  fetch("http://localhost:3000/api/products/order", sendCart)
  .then((response) => response.json())
  .then((data) => {
    
    localStorage.setItem("orderId", data.orderId);
    
    if (formControl()) {
      document.location.href = `confirmation.html?id=${data.orderId}`;
    }
  });
}); // addventlistener fin
};

// Appel de la fonction
formOrder();

