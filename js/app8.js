const primaryButtons = document.querySelectorAll('.button-primary')
const list = document.querySelector("#lista-carrito")
const emptyList = document.getElementById("vaciar-carrito")
const removeButton = document.querySelector('.remove-button')

primaryButtons.forEach(function(elem){
    elem.addEventListener('click',event => {
        let dataID = elem.getAttribute('data-id')
        addToCarrito(dataID)
    })
})

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

emptyList.addEventListener("click", () => {
    while (list.lastElementChild !== null) {
        list.removeChild(list.lastElementChild);
    }
    
})

function addOneToValuesIfExists(id, card) {
    let cantidad = document.getElementsByClassName(`cantidad-${id}`)[0]
    if (cantidad) {
        let precio = cantidad.parentElement.children[2]
        cantidad.textContent = parseInt(cantidad.textContent) + 1
        precio.textContent = parseInt(precio.textContent) + parseInt(card.lastElementChild.children[3].querySelector(".u-pull-right").textContent)
    }
}


function removeOne(id, card) {
    let cantidad = document.getElementsByClassName(`cantidad-${id}`)[0]
    if (cantidad) {
        let row = cantidad.parentElement;
        let precio = cantidad.parentElement.children[2]
        cantidad.textContent = parseInt(cantidad.textContent) - 1
        precio.textContent = parseInt(precio.textContent) - parseInt(card.lastElementChild.children[3].querySelector(".u-pull-right").textContent)
        if (cantidad.textContent == 0) {
            row.parentElement.removeChild(row);
        }
    }
}


function createNewElement(id, card, element) {
    let image = document.createElement("img")
    let nombre = document.createElement("th")
    let precio = document.createElement("th")
    let cantidad = document.createElement("th")
    let remove = document.createElement("button")
    addPropertiesToElements(cantidad, id, image, card, nombre, precio, remove)
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
    args[0].appendChild(args[1])
    args[0].appendChild(args[2])
    args[0].appendChild(args[3])
    args[0].appendChild(args[4])
    args[0].appendChild(args[5])
    list.lastElementChild.appendChild(args[0])
}

