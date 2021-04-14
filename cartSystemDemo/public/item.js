/*Menu Items*/
var itemRef = firestore.doc("items/menuitems");

var Menu = {
    //Read menu item properties from input
    itemType: document.querySelector(".itemtype"),
    itemName: document.querySelector(".itemname"),
    itemPrice: document.querySelector(".itemprice"),
    description: document.querySelector(".description"),
    menuDisplay: document.querySelector(".menu"),

    addMenuItems: function() {
        //Write menu item properties to firestore
        if (this.itemName.value == '' || this.itemPrice.value == '' || this.description.value == '') {
            alert('DO NOT LEAVE ANY FIELDS BLANK');
            return;
        }

        itemName = this.itemName.value;
        itemType = this.itemType.value;
        itemPrice = parseFloat(this.itemPrice.value, 10);
        description = this.description.value;

        //Write menu item properties to Firestore
        itemRef.collection(itemType).doc(itemName).set({
                name: itemName,
                price: itemPrice,
                description: description,
                type: itemType
            })
            .then(() => {
                console.log("Document successfully written!");
                location.reload();
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    },

    getAllMenuItems: function() {
        //Find firestore menu items      
        this.getMenuItemsFrom("Pizza")
        this.getMenuItemsFrom("Drinks")
        this.getMenuItemsFrom("Sides")
        this.getMenuItemsFrom("Desserts")
    },
    getMenuItemsFrom(itemtype) {
        //Get all menu items from specific item type
        itemRef.collection(itemtype).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data())
                        //Add HTML Element for each menu item w/ add button
                    this.menuDisplay.innerHTML += `<span>` +
                        doc.data().name + " " + "$" +
                        doc.data().price + " " +
                        `<button type="button" class="itemButton" onclick="Cart.addItemToCart('` + doc.data().name + `', '` + doc.data().type + `')">+</button>` +
                        `</span>` +
                        `<div>` + doc.data().description + `</div>` +
                        `<br><br>`
                });
            })
    }
}

//Get menu items from Firestore when the page loads
window.onload = Menu.getAllMenuItems();