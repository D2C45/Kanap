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