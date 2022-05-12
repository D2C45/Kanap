const items = document.getElementById('items');


fetch("http://localhost:3000/api/products")
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(couchList) {
        for(let couch of couchList) {
            items.innerHTML += `<a href="./product.html?id=${couch._id}">
                                    <article>
                                        <img src="${couch.imageUrl}" alt="${couch.altTxt}">
                                        <h3 class="productName">${couch.name}</h3>
                                        <p class="productDescription">${couch.description}</p>
                                    </article>
                                </a>`
        };
    })
    .catch(function(error) {
        console.log(error);
    })
