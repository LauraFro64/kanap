/** PAGE D'ACCUEIL **/

// Stockage des variables
let apiURL = 'http://localhost:3000/api'
let items = document.getElementById("items") // => on récupère l'id du code HTML nous concernant

// Récupération des données de l'API
// Async = fonction qui s'exécute de manière asynchrone en utilisant une promesse comme valeur de retour
// Await suspend l’exécution de la fonction jusqu’à ce que la promesse soit réglée
// Return stoppe la fonction et renvoie un résultat dans la console
async function getProducts() {
    let products = await fetch(apiURL + '/products/'); 
    console.log(products)
    return products.json();
    }

// Appel de la fonction et exécution d'une promesse avec .then
    getProducts()
        .then(function(products)
        {

// Création d'une boucle for reprenant les données de l'API
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
    }) 