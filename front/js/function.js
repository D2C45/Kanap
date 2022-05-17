// fonction qui envoie une requête à adress et qui renvoit les données JSON si ok
/**
 * Envoie une requête à adress qui renvoit les données JSON si ok
 * @param {url} adress chemin d'accès(url ou chemin relatif)
 * @returns {json}
 */
async function request(adress) {
    let response = await fetch(adress);
    if (response.ok) {
        return response.json();
    } else {
        console.log(error);
    }
}

export {request};