
// Conversion des données de la chaine de caractère JSON en objet javascript
let cart = JSON.parse(localStorage.getItem("product"));

// Variable pour stocker les Id de chaque article présent dans le panier (utilisés pour créer la commande)
let products = [];

// Variable qui récupère l'orderId envoyé comme réponse par le serveur lors de la requête POST
let orderId = "";

// Affichage du contenu du panier
async function displayCart() {
  const CartContain = document.getElementById("cart__items");
  let cartArray = [];

  // Si le localstorage est vide
  if (cart === null || cart === 0) {
    CartContain.textContent = "Votre panier est vide";
  } else {
    console.log("Des produits sont présents dans le panier");
  }
  
  // Si le localstorage contient des produits
  for (i = 0; i < cart.length; i++) {
    const product = await getProductById(cart[i].id);
    const totalPriceItem = (product.price *= cart[i].quantity);
    cartArray += `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
                  <div class="cart__item__img">
                      <img src="${product.imageUrl}" alt="${product.altTxt}">
                  </div>
                  <div class="cart__item__content">
                      <div class="cart__item__content__description">
                          <h2>${product.name}</h2>
                          <p>${cart[i].color}</p>
                          <p>Prix unitaire: ${product.price}€</p>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p id="quantité">
                              Qté : <input data-id= ${cart[i].id} data-color= ${cart[i].color} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cart[i].quantity}>
                            </p>
                            <p id="sousTotal">Prix total pour cet article: ${totalPriceItem}€</p> 
                        </div>
                        <div class="cart__item__content__settings__delete">
                          <p data-id= ${cart[i].id} data-color= ${cart[i].color} class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </article>`;
  }
  // Boucle d'affichage du nombre total d'articles dans le panier et de la somme totale
  let totalQuantity = 0;
  let totalPrice = 0;

  for (i = 0; i < cart.length; i++) {
    const article = await getProductById(cart[i].id);
    totalQuantity += parseInt(cart[i].quantity);
    totalPrice += parseInt(article.price * cart[i].quantity);
  }

  document.getElementById("totalQuantity").innerHTML = totalQuantity;
  document.getElementById("totalPrice").innerHTML = totalPrice;

  if (i == cart.length) {
    const parser = new DOMParser();
    const displayBasket = parser.parseFromString(cartArray, "text/html");
    CartContain.appendChild(displayBasket.body);
    changeQuantity();
    deleteItem();
  }
}

  // // Addition des prix avec la méthode "reduce" qui garde en mémoire, à chaque calcul, les résultats de l'opération en cumulant la somme précédente
  // const reducer = (accumulator, currentValue) => accumulator + currentValue; // en paramètre un accumulateur => valeur précédente et la valeur courante
  // montantTotal = priceProductsInCart.reduce(reducer,0); // obligation de mettre une valeur initiale 0 sinon erreur

// Récupération des produits de l'API
async function getProductById(productId) {
  return fetch("http://localhost:3000/api/products/" + productId)
    .then(function (res) {
      return res.json();
    })
    .catch((err) => {
      // Erreur serveur
      console.log("erreur");
    })
    .then(function (response) {
      return response;
    });
}
displayCart();

// MODIFICATION DE LA QUANTITE DU PRODUIT DIRECTEMENT DEPUIS LE PANIER
function changeQuantity() {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((quantityInput) => {
    quantityInput.addEventListener("change", (event) => {
      event.preventDefault();
      
      // Target permet de retrouver l'objet associé à l'évèment
      const inputValue = event.target.value;
      const dataId = event.target.getAttribute("data-id");
      const dataColor = event.target.getAttribute("data-color");
      let cart = localStorage.getItem("cart");
      let items = JSON.parse(cart);

      items = items.map((item) => {
        if (item.id === dataId && item.color === dataColor) {
          item.quantity = inputValue;
        }
        return item;
      });
      // Mise à jour du localStorage
      let itemsStr = JSON.stringify(items);
      localStorage.setItem("cart", itemsStr);
      // Refresh de la page Panier
      location.reload();
    });
  });
}


//SUPPRESSION D'UN ARTICLE DU PANIER
// Déclaration d'une fonction fléchée qui engendre une variable dans laquelle on récupère l'élément HTML utile
function deleteItem() {
  const deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();

      // Enregistrement de l'id et de la couleur sélectionnés par le bouton supprimer
      // Target permet de retrouver l'objet associé à l'évèment
      const deleteId = event.target.getAttribute("data-id");
      const deleteColor = event.target.getAttribute("data-color");

      // Sélection des éléments à garder avec la méthode .filter 
      // Suppression de l'élément cliqué avec la logique inversée "!=="
      cart = cart.filter(
        (element) => !(element.id == deleteId && element.color == deleteColor)
      );

      // Mise à jour du local storage avec les produits restants
      // Traduction de l'objet javascript en chaine de caractère JSON
      localStorage.setItem("cart", JSON.stringify(cart));

      // Confirmation de la suppression du produit
      alert("Votre article a bien été supprimé de votre panier !");

      // Rechargement de la page pour actualiser le contenu du panier
      window.location.href = "cart.html"; 
      });
    })
  };
// Appel de la fonction
deleteItem();


// AFFICHAGE DU NOMBRE TOTAL D'ARTICLES DANS LE PANIER
totalArticles = () => {
  let totalItems = 0;
  for (e in cart) {

    // Analyse et converti la valeur 'quantity' dans le localstorage en une chaîne, et renvoie un entier (parseInteger), sur la base décimale de 10 
    // Transforme la donnée string en donnée number
    const newQuantity = parseInt(cart[e].quantity, 10);

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

     // Création d'une variable pour éviter de répéter le code pour le prénom, nom et ville
    // Regex pour le contrôle des champs Prénom, Nom et Ville
  const regExPrenomNomVille = (value) => {
  // Utilisation des expressions rationnelles (= motifs utilisées pour correspondre à certaines combinaisons de caractères au sein de chaînes de caractères)
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

  // Fonctions de contrôle du champ Prénom:
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
    // Enregistrer le formulaire dans le local storage
    localStorage.setItem("formData", JSON.stringify(formData));

    document.querySelector("#order").value =
      "Cliquez pour confirmer et passer commande !";
    sendToServer();
  } else {
    error("Veuillez bien remplir le formulaire");
  }

  /* FIN GESTION DU FORMULAIRE */

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

/* FIN REQUÊTE DU SERVEUR ET POST DES DONNÉES */
// Maintenir le contenu du localStorage dans le champs du formulaire

let dataFormulaire = JSON.parse(localStorage.getItem("formData"));

if (dataFormulaire) {
  document.querySelector("#firstName").value = dataFormulaire.firstName;
  document.querySelector("#lastName").value = dataFormulaire.lastName;
  document.querySelector("#address").value = dataFormulaire.address;
  document.querySelector("#city").value = dataFormulaire.city;
  document.querySelector("#email").value = dataFormulaire.email;
} else {
  console.log("Le formulaire est vide");
}}
formOrder();