const primaryButtons = document.querySelectorAll('.button-primary')
const list = document.querySelector("#lista-carrito")
const emptyList = document.getElementById("vaciar-carrito")
const removeButton = document.querySelector('.remove-button')
const cartItems = [];

primaryButtons.forEach(function(elem){
    elem.addEventListener('click',event => {
        let dataID = elem.getAttribute('data-id')
        addToCarrito(dataID)
    })
})


emptyList.addEventListener("click", clearCart)

// Add to carrito new elements 

function addToCarrito(id){
    let element = document.createElement("tr")
    let card = null;
    let cardArray = document.querySelectorAll(".card")
    cardArray.forEach(function(elem){
        if (elem.lastElementChild.lastElementChild.getAttribute('data-id') == id){
            card =  elem
        }
    })
    if (document.getElementsByClassName(`cantidad-${id}`).length === 0 ){
        createNewElement(id, card, element)
    }else {
        addOneToValuesIfExists(id, card)
    }
}




function clearCart() {
    emptyList.addEventListener("click", () => {
        const tbody = list.querySelector("tbody")
        while (tbody.lastElementChild) {
            tbody.removeChild(tbody.lastElementChild)
        }
    })
}

function addOneToValuesIfExists(id, card) {
    let cantidad = document.getElementsByClassName(`cantidad-${id}`)[0]
    if (cantidad) {
        let precio = cantidad.parentElement.children[2]
        cantidad.textContent = parseInt(cantidad.textContent) + 1
        precio.textContent = parseInt(precio.textContent) + parseInt(card.lastElementChild.children[3].querySelector(".u-pull-right").textContent)
        addToCartAndSessionStorage(id,card)
    }
}


function removeOne(id, card) {
    let cantidad = document.getElementsByClassName(`cantidad-${id}`)[0];
    if (cantidad) {
        let row = cantidad.parentElement;
        let precio = cantidad.parentElement.children[2];
        cantidad.textContent = parseInt(cantidad.textContent) - 1;
        precio.textContent = parseInt(precio.textContent) - parseInt(card.lastElementChild.children[3].querySelector(".u-pull-right").textContent);
        removeFromCartAndSessionStorage(id)
        if (cantidad.textContent == 0) {
            row.parentElement.removeChild(row);
            
        }
    }
}

// Session storage functions

function addToCartAndSessionStorage(id, card) {
    const existingItem = cartItems.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += parseInt(card.lastElementChild.children[3].querySelector(".u-pull-right").textContent)
    } else {
        const newItem = {
            id: id,
            name: card.lastElementChild.firstElementChild.textContent,
            price: parseInt(card.lastElementChild.children[3].querySelector(".u-pull-right").textContent),
            quantity: 1,
            totalPrice: parseInt(card.lastElementChild.children[3].querySelector(".u-pull-right").textContent),
            image: card.firstElementChild.getAttribute('src'), // Include the image URL
        };
        cartItems.push(newItem);
    }
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log(cartItems)
}

function removeFromCartAndSessionStorage(id) {
    const itemIndex = cartItems.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        const item = cartItems[itemIndex];
        item.quantity--;

        if (item.quantity <= 0) {
            cartItems.splice(itemIndex, 1);
        } else {
            item.totalPrice -= item.price;
        }
        sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
}

function clearCartAndSessionStorage() {
    cartItems.length = 0; 
    sessionStorage.removeItem("cartItems"); 
}

function handleDOMContentLoaded() {
    const storedCartItems = JSON.parse(sessionStorage.getItem("cartItems"));
    if (storedCartItems) {
        cartItems.push(...storedCartItems);
        const tableBody = document.querySelector("#lista-carrito tbody");
        clearCart()
        cartItems.forEach(item => {
            const row = createRowForItem(item);
            tableBody.appendChild(row);
        });
    }
}


function createRowForItem(item) {
    const row = document.createElement("tr");
    row.appendChild(createTableCellWithImage(item.image, item.name));
    row.appendChild(createTableCellWithText(item.name));
    row.appendChild(createTableCellWithText(item.price));
    row.appendChild(createTableCellWithText(item.quantity));
    row.appendChild(createRemoveButton(item));
    return row;
}

function createTableCellWithImage(imageSrc, altText) {
    const cell = document.createElement("td");
    cell.innerHTML = `<img src="${imageSrc}" alt="${altText}" width="150" height="100">`;
    return cell;
}

function createTableCellWithText(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
}

function createRemoveButton(item) {
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
        removeItemFromCart(item.id);
    });
    const cell = document.createElement("td");
    cell.appendChild(removeButton);
    return cell;
}


// Add new elements to cart

function createNewElement(id, card, element) {
    let image = document.createElement("img")
    let nombre = document.createElement("th")
    let precio = document.createElement("th")
    let cantidad = document.createElement("th")
    let remove = document.createElement("button")
    addPropertiesToElements(cantidad, id, image, card, nombre, precio, remove)
    
    addToCartAndSessionStorage(id,card)
    addNewElements(element, image, nombre, precio, cantidad, remove)
}



function addPropertiesToElements(cantidad, id, image, card, nombre, precio, remove) {
    cantidad.classList.add(`cantidad-${id}`)
    cantidad.textContent = "1"
    addImageProperties(image, card)
    nombre.textContent = card.lastElementChild.firstElementChild.textContent
    precio.textContent = card.lastElementChild.children[3].querySelector(".u-pull-right").textContent
    list.style.listStyle ="none"
    list.style.padding ="0"
    addRemoveProperties(remove, id,card)
}   

function addImageProperties(image, card) {
    image.src = card.firstElementChild.getAttribute('src')
    image.width = 150
    image.height = 100
}

function addRemoveProperties(remove, id,card) {
    remove.textContent = "eliminar"
    remove.classList.add(`remove-button`)
    remove.addEventListener('click', () => {
        removeOne(id,card)
    })
}

function addNewElements(...args) {
    let element = args[0]
    element.appendChild(args[1])
    element.appendChild(args[2])
    element.appendChild(args[3])
    element.appendChild(args[4])
    element.appendChild(args[5])

    list.lastElementChild.appendChild(args[0])
}

