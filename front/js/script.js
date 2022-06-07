/** PAGE D'ACCUEIL **/

// Récupération des données de l'API
// Async = fonction qui s'exécute de manière asynchrone en utilisant une promesse comme valeur de retour
// Await suspend l’exécution de la fonction jusqu’à ce que la promesse soit réglée
// Return stoppe la fonction et renvoie un résultat dans la console
async function getProducts() {
    let products = await fetch('http://localhost:3000/api/products'); 
    console.log(products)
    return products.json();
    }

// Appel de la fonction et exécution d'une promesse avec .then
    getProducts()
        .then(function(products)
        {

// Création d'une boucle for reprenant les données de l'API
            const items = document.getElementById("items") // => on récupère l'id du code HTML nous concernant
            for (let i=0; i<products.length; i++) 
            { 
                
// Personnalisation des éléments HTML avec les données de l'API
                let product = products[i]
                items.innerHTML += 
                `
                    <a href="./product.html?id=${product._id}"> 
                    <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}"> 
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                    </article>
                    </a> 
                ` 
            }
console.log("ok produits crées");
    }) 


/** 
// Récupération des données de l'API
// Async = fonction qui s'exécute de manière asynchrone en utilisant une promesse comme valeur de retour
// Await suspend l’exécution de la fonction jusqu’à ce que la promesse soit réglée

async function getProducts() {
    let products = await fetch('http://localhost:3000/api/products'); 
    console.log(products)
    return products.json();
}

// Création des cards produits via une boucle
async function creationProducts() {
    let products = await getProducts() 
    .then(function (product) {
        product.forEach(products => {  // exécute chaque élément du tableau, une fois, dans l'ordre croissant
           let productLink = document.createElement("a"); // création d'un élément stocké dans une variable
           document.querySelector(".items").appendChild(productLink); // positionnement du nouvel enfant dans le code html
           productLink.setAttribute("href", "./product.html?id=" + products._id); // personnalisation de l'élément

// Création de l'article
           let productArticle = document.createElement("article");
           productLink.appendChild(productArticle);

// Modification des attributs de l'image
           let productImg = document.createElement("img");
           productArticle.appendChild(productImg);
           productImg.src = products.imageUrl;
           productImg.alt = products.altTxt;
           
// Modification de la valeur du titre h3
           let productName = document.createElement("h3");
           productArticle.appendChild(productName);
           productName.innerHTML = products.name;

// Modification de la valeur du descriptif p
           let productDescription = document.createElement("p");
           productArticle.appendChild(productDescription);
           productDescription.innerHTML = products.description;    
        });
    });
    
    console.log("ok produits crées");
}

//Appel des fonctions
getProducts();
creationProducts();
**/