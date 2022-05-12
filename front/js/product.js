const currentUrlString = window.location.href;
const currentUrl = new URL(currentUrlString);
const currentId = currentUrl.searchParams.get("id");
const apiUrl = new URL(`http://localhost:3000/api/products/${currentId}`);

fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(couch) {
            document.title = couch.name;
            document.getElementsByClassName("item__img")[0].innerHTML = `<img src="${couch.imageUrl}" alt="Photographie d'un canapé">`;            
            document.getElementById("title").textContent = couch.name;
            document.getElementById("price").textContent = couch.price;
            document.getElementById("description").textContent = couch.description;
            for(let color of couch.colors) {
                let colorList = document.getElementById("colors");
                const newElt = document.createElement("option");
                newElt.textContent = color;
                newElt.setAttribute("value",color);
                colorList.appendChild(newElt);
            };
    })
    .catch(function(error) {
        console.log(error);
    })
