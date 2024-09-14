import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Create a new database
const appSettings = {
    databaseURL: "https://realtime-database-e8802-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings) 
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value

    push(shoppingListInDB, inputValue)

    // Clear the input field every time the function is called
    clearInputFieldEl()
})

// Call the on value function and the snapshot function 
onValue(shoppingListInDB, function(snapshot) {
    // Convert snapshot values from an object to an array
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearShoppingListEl()
    
        // Create a for loop to iterate through the itemsArray
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemId = currentItem[0]
            let currentItemVale = currentItem[1]
            // Append the items to the shopping list using the function called appendItemToShoppingListEl
            appendItemToShoppingListEl(currentItem)
        } 
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

// Create a function called clearShoppingListEl to clear the shopping list when it is called before the for loop
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Create a function called clearInputFieldEl to clear the input field when button is clicked
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Create a function called to append new items to the list using the inner HTML
function appendItemToShoppingListEl (item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    newEl.addEventListener("click", function(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        // Remove items from the database
        remove(exactLocationOfItemInDB)

    })

    shoppingListEl.append(newEl)
}