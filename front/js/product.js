// import de la fonction request permettant de faire des requêtes et de renvoyer la réponse en JSON
import {request} from './function.js';

// variable récupérant l'url de la page (chaine de caractères)
const currentUrlString = window.location.href;
// variable qui convertit la chaine de caractères en url
const currentUrl = new URL(currentUrlString);
// variable qui récupère l'id de l'url
const currentId = currentUrl.searchParams.get("id");

/**
 * Ajoute le texte récupéré dans la balise avec l'id
 * @param {Object} couch les caractéristiques du canapé
 * @param {String} id l'id de la balise html où insérer le texte
 * @param {String} content la clé de l'objet couch qui contient le contenu à insérer
 */
function text(couch,id,content=id) {
    document.getElementById(id).textContent = couch[content];
};

/**
 * Ajoute les couleurs dans le menu déroulant
 * @param {Object} couch les caractéristiques du canapé
 */
function colorList(couch) {
    for(let color of couch.colors) {
        let list = document.getElementById("colors");
        list.innerHTML += `<option value="${color}">${color}</option>`;
    };
}

/**
 * Ajoute les caractéristiques du canapé dans product.html
 * @param {Object} couch les caractéristiques du canapé
 */
function addElements(couch) {
    document.title = couch.name;
    document.getElementsByClassName("item__img")[0].innerHTML = `<img src="${couch.imageUrl}" alt="Photographie d'un canapé">`;
    text(couch,'title','name');
    text(couch,'price');
    text(couch,'description');
    colorList(couch);
}

// requête pour récupérer la config, puis requête pour récupérer les caractéristiques du canapé sur l'API et ajouter les éléments dans product.html
request("../js/config.json")
    .then(function(config) {
        request(config.host + currentId)
            .then(function(couch) {
                addElements(couch);
            });
    });

// ---------------------------------------------------------------

/**
 * Sauvegarde le panier
 * @param {Object} cart le panier
 */
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Récupère le panier
 * @returns {JSON | Array} le panier ou un tableau vide si le panier n'existe pas
 */
function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

/**
 * Recherche si le produit est déjà présent dans le panier avec le même id et la même couleur
 * @param {Object} product le produit
 * @param {JSON} cart le panier
 * @returns {Object | undefined} le produit trouvé ou undefined si non trouvé
 */
function findProductIntoCart (product, cart) {
    let found = undefined;
    for (let article of cart) {
        if (article.id == product.id && article.color == product.color) {
            found = article;
            break;
        }
    }
    return found;
}

/**
 * Crée l'objet produit avec les caractéristiques (id, quantité et couleur) récupérées sur la page courante
 * @returns {object}
 */
function createProductObject() {
    let product = {
        id: currentId,
        quantity: eval(document.getElementById('quantity').value, 10),
        color: document.getElementById('colors').value
    }
    return product;
}

/**
 * Ajoute le produit au panier ou incrémente la quantité si le produit est déjà présent dans le panier
 * @param {object} product
 */
function addToCart(product) {
    let cart = getCart();
    let found = findProductIntoCart(product, cart);
    if (found != undefined) {
        found.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    saveCart(cart);
}

/**
 * Vérifie que les champs couleur et quantité soit correctement renseignés
 * Renvoie une alerte si mal renseignés
 * Ajoute au panier si bien renseignés
 */
function checkInputAndAddToCart() {
    let product = createProductObject();
    if (product.color == '') {
        window.alert("Veuillez choisir une couleur");
    } else {
        if (product.quantity < 1 || product.quantity > 100 || !Number.isInteger(product.quantity)) {
            window.alert("Veuillez choisir une quantité valable entre 1 et 100");
        } else {
            addToCart(product);
        }
    }
}

// Au click sur le bouton "Ajouter au panier", vérifie les champs et ajoute au panier
document.getElementById('addToCart').addEventListener('click', checkInputAndAddToCart);