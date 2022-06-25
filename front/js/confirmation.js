// La page Confirmation
// Un message de confirmation de commande, remerciant l'utilisateur pour sa commande, et indiquant l'identifiant de commande envoyé par l’API.
// Sur cette page, l'utilisateur doit voir s’afficher son numéro de commande. Il faudra veiller à ce que ce numéro ne soit stocké nulle part.

// Ciblage de la balise 'orderId'
const orderId = document.getElementById('orderId');

confirmation = () => {
    // Affichage du numéro de commande
    orderId.innerHTML = localStorage.getItem('orderId');

    // La méthode .clear() efface toutes les clés stockées
    localStorage.clear(); 
}

confirmation();


