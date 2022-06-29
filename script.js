// Initialize the Dexie database in our APp
const db = new Dexie('TinnyShoppingApp')
// If we are going to change any of the parameters, we alos have to change the version number by increasing by 1
db.version(1).stores({ items: '++id,name,price,isPurchased' })

const itemForm = document.getElementById('itemForm')
const itemsList = document.getElementById('itemsList')
const itemsTotalPrice = document.getElementById('itemsTotalPrice')

// How to use items stored in the dexie databas
const populateItemsList = async () => {

    // convert all items in the database to an array and populate the html using map and template literals
    const allItems = await db.items.reverse().toArray()
    itemsList.innerHTML = allItems.map(item => `
    <div class="item ${item.isPurchased && 'purchased'}">
        <input 
        type="checkbox" 
        class="checkbox"
        ${item.isPurchased && 'checked'}
        />

        <div class="itemInfo">
          <p>${item.itemName}</p>
          <p> #${item.itemPrice} * ${item.itemQty} </p>
        </div>

        <button id="deleteItemBtn">X</button>
      </div>
    `)

    // Calculate for the total price of items using map and reduce
    const arrayOfPrices = allItems.map(item => item.itemPrice * item.itemQty)
    const totalPrice = arrayOfPrices.reduce((a, b) => a + b, 0)

    // populate the total totalprice div html
    itemsTotalPrice.innerText = 'Total Price: #' + totalPrice

}

// call the populateitemslist function when the window loads up
window.onload = populateItemsList()


// When the submit button is clicked, we want to get the values of our input using an async function and populate the Dexie database
itemForm.onsubmit = async (event) => {
    event.preventDefault()

    const itemName = document.getElementById('nameInput').value
    const itemQty = document.getElementById('qtyInput').value
    const itemPrice = document.getElementById('priceInput').value

    // The above code returns a promise that we can pass into an await function and then populate the dexie database
    // Also, this syntax is like this because of object destructuring
    await db.items.add({ itemName, itemQty, itemPrice })
    

    // Clear the form on submit
    itemForm.reset()
}