// SELECT ITEMS
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

//EDIT OPTION
let editElement;
let editFlag = false;
let editID = "";


// EVENT LISTENERS
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

//FUNCTIONS
function addItem(a){
    a.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime.toString();

    if(value && !editFlag){
        createListItem(id, value);
        displayAlert("Item added", "success");
        container.classList.add("show-container");
        addToLocalStorage(id, value);
        setBackToDefault();
    }
    else if (value && editFlag){
        editElement.innerHTML = value;
        displayAlert("Item changed", "success");
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    else{
        displayAlert("Please enter value", "danger");
        
    }
}

function clearItems(){
    const items = document.querySelector(".grocery-item");

    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert("Empty List", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}

function deleteItem(a){
    const element = a.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove("show-container");
    }

    displayAlert("Item Removed", "danger");
    setBackToDefault();
    removeFromLocalStorage(id);
}

function editItem(a){
    const element = a.currentTarget.parentElement.parentElement;
    editElement = a.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "Edit";
}

function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    setTimeout(function () {
      alert.textContent = "";
      alert.classList.remove(`alert-${action}`);
    }, 1000);
}

function addToLocalStorage(id, value){
    const grocery = {id, value};
    let items = getLocalStorage();
    items.push(grocery) ;
    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem("list")?JSON.parse
    (localStorage.getItem("list")):[];
}

function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value);
        });
        container.classList.add("show-container");
    }
}

function createListItem(id, value){
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
        
    element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-delete"></i>
            </button>
        </div>`;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element);
}