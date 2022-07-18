/** PAGE CONFIRMATION **/
// Un message de confirmation de commande, remerciant l'utilisateur pour sa commande, et indiquant l'identifiant de commande envoyé par l’API.
// Sur cette page, l'utilisateur doit voir s’afficher son numéro de commande. Il faudra veiller à ce que ce numéro ne soit stocké nul part.

// Récupération des paramètres de requête du produit => ".search" pointe la partie de l'URL qui suit le symbol ?
let params = new URLSearchParams(window.location.search);

// Ciblage de la balise 'orderId'
const order = params.get("orderId");

confirmation = () => {
    // Affichage du numéro de commande
    orderId.innerHTML = order;

    // La méthode .clear() efface toutes les clés stockées
    localStorage.clear(); 
}

confirmation();



