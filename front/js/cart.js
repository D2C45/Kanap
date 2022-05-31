// import de fonctions
import {request, getCart, saveCart, findProductIntoCart} from './function.js';

// variable récupérant l'élément avec l'Id 'cart__items'
const cartItems = document.getElementById('cart__items');

/**
 * Crée la chaine de caractères à insérer dans le HTML pour un canapé
 * @param {object} article l'article récupéré dans le panier via localStorage
 * @param {object} couchDetails les détails du canapé récupérés sur l'API via l'id du canapé
 * @returns {string} la chaine de caractères à insérer dans le HTML pour un canapé
 */
function addElementsIntoCart(article, couchDetails) {
    let content =   `<article class="cart__item" data-id="${couchDetails._id}" data-color=
                    "${article.color}">
                        <div class="cart__item__img">
                            <img src="${couchDetails.imageUrl}" alt="${couchDetails.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${couchDetails.name}</h2>
                                <p>${article.color}</p>
                                <p>${couchDetails.price.toFixed(2)} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>`
    return content;
};

/**
 * Récupère le panier
 * Parcourt le panier pour récupérer les articles
 * Interroge l'api pour récupérer les détails des canapés à partir de l'id
 * Concatène les chaines de caractère de chaque canapé avec la fonction addElementsIntoCart
 * @returns {string} la chaine de caractères à insérer dans le HTML pour tous les canapés du panier
 */
async function displayCart() {
    let cart = getCart();
    let content = '';
    for(let article of cart) {
        let currentId = article.id;
        let config = await request("../js/config.json");
        let couchDetails = await request(config.host + currentId);
        content += addElementsIntoCart(article, couchDetails);
    }
    return content;
}

// Récupère le contenu et l'ajoute au HTML pour afficher le panier
let content = await displayCart();
cartItems.innerHTML = content;


// Variables récupérant les éléments qui affichent la quantité totale et le prix total
const totalQuantityElt = document.getElementById('totalQuantity');
const totalPriceElt = document.getElementById('totalPrice');

/**
 * Calcule et renvoie la quantité totale d'article présent dans le panier dans l'élément quantité
 */
function getTotalArticles() {
    let cart = getCart();
    let totalQuantity = 0;
    for(let article of cart) {
        totalQuantity += article.quantity;
    }
    totalQuantityElt.textContent = totalQuantity;
}

// Affiche la quantité totale d'article présent dans le panier
getTotalArticles();

/**
 * Calcule et renvoie le prix total du panier
 * @returns {number}
 */
async function getTotalPrice() {
    let cart = getCart();
    let totalPrice = 0;
    for(let article of cart) {
        let currentId = article.id;
        let config = await request("../js/config.json");
        let couchDetails = await request(config.host + currentId);
        totalPrice += (article.quantity * (couchDetails.price * 10)) / 10;
    }
    return totalPrice;
}

// Affiche le prix total du panier
async function displayPrice() {
    let totalPrice = await getTotalPrice();
    totalPriceElt.textContent = totalPrice.toFixed(2);
}

displayPrice();

/**
 * Récupère l'id et la couleur dans l'élément article qui contient l'élément quantité
 * Crée un objet avec l'id et la couleur du produit dont la quantité est à modifier
 * @param {string} element élément HTML du produit dont la quantité est à modifier
 * @param {string} cart le panier stocké dans le localStorage
 * @returns {object} un objet avec l'id et la couleur du produit dont la quantité est à modifier
 */
function getIdAndColor(element, cart) {
    let article = element.closest("article");
    let product = {
        id: article.dataset.id,
        color: article.dataset.color
    }
    let foundProduct = findProductIntoCart(product, cart);
    return foundProduct;
}

// Récupère la liste des éléments itemQuantity dans un tableau
let itemQuantityList = document.getElementsByClassName("itemQuantity");

/**
 * Change la quantité du produit dans le panier stocké dans le localStorage
 * @param {string} itemQuantity élément HTML du produit dont la quantité est à modifier
 */
function changeValue(itemQuantity) {
    let cart = getCart();
    let foundProduct = getIdAndColor (itemQuantity, cart);
    let value = Number(itemQuantity.value);
    if (value < 1 || value > 100 || !Number.isInteger(value)) {
        window.alert("Veuillez choisir une quantité valable entre 1 et 100");
        location.reload();
    } else {
        itemQuantity.defaultValue = itemQuantity.value;
        foundProduct.quantity = value;
    saveCart(cart);
    }    
}

// Boucle sur tous les éléments itemQuantity pour changer la quantité dans le panier stocké
// dans le localStorage et actualiser la quantité et le prix total
for(let itemQuantity of itemQuantityList) {
    itemQuantity.addEventListener('change', function() {
        changeValue(itemQuantity);
        getTotalArticles();
        displayPrice();
    });
}

// Récupère les boutons supprimer dans un tableau
let deleteItemList = document.getElementsByClassName("deleteItem");

/**
 * Supprime le produit dans le localStorage et le HTML
 * @param {string} deleteItem un bouton supprimer du panier
 */
function deleteProduct(deleteItem) {
    let cart = getCart();
    let article = deleteItem.closest("article");
    let foundProduct = getIdAndColor (deleteItem, cart);
    let index = cart.indexOf(foundProduct);
    cartItems.removeChild(article);
    cart.splice(index, 1);
    saveCart(cart);
}

// Boucle qui parcourt les boutons supprimer pour qu'au click, le produit soit supprimé
// du localStorage et du HTML, et actualiser la quantité et le prix total
for(let deleteItem of deleteItemList) {
    deleteItem.addEventListener('click', function() {
        deleteProduct(deleteItem);
        getTotalArticles();
        displayPrice();
    });
}