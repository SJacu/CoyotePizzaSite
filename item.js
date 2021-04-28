/*Menu Items*/
var firestore = firebase.firestore();
var itemRef = firestore.doc("items/menuitems");

var Menu = {
    //Read menu item properties from input
    itemType: document.querySelector(".itemtype"),
    itemName: document.querySelector(".itemname"),
    itemPrice: document.querySelector(".itemprice"),
    description: document.querySelector(".description"),
    menuDisplay: document.querySelector(".menu"), //Most likley not needed

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
    //This function will be replaced by updateSpecificMenu()
    getAllMenuItems: function() {
        //Find firestore menu items      
        this.getMenuItemsFrom("Pizza")
        this.getMenuItemsFrom("Drinks")
        this.getMenuItemsFrom("Sides")
        this.getMenuItemsFrom("Desserts")
    },

    getMenuItemsFrom(itemtype) {
        //Get all menu items from specific item type
        menuDisplay = document.querySelector(".menu" + itemtype)
        console.log(".menu" + itemtype);
        auth.onAuthStateChanged(user => {
            if (!user) {
                itemRef.collection(itemtype).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            //Add HTML Element for each menu item w/ add button
                            menuDisplay.innerHTML += `<div class="menuBox"><div class="boxes basic-div border-solid"></div><div class="basic-div flex-direction-column menuItem"><span>` +
                                doc.data().name + " " + "$" +
                                doc.data().price + " " +
                                `<button type="button" class="itemButton" onclick="Cart.addItemToCart('` + doc.data().name + `', '` + doc.data().type + `')">&nbsp;+&nbsp;</button>` +
                                `</span>` +
                                `<div>` + doc.data().description + `</div>` +
                                `</div></div><br><br>`;
                        });
                    })
            }
            //Check if the user is an admin
            if (user) {
                db.collection("users").where("UID", "==", user.uid).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        admin = doc.data().admin;
                    });
                })

                itemRef.collection(itemtype).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            //Add HTML Element for each menu item w/ add button
                            if (admin) {
                                menuDisplay.innerHTML += `<div class="menuBox"><div class="boxes basic-div border-solid"></div><div class="basic-div flex-direction-column menuItem"><span>` +
                                    doc.data().name + " " + "$" +
                                    doc.data().price + " " +
                                    `<button type="button" class="itemButton" onclick="Cart.addItemToCart('` + doc.data().name + `', '` + doc.data().type + `')">&nbsp;+&nbsp;</button>` +
                                    `<br><button type="button" class="itemButton" onclick="Menu.removeMenuItem('` + doc.data().name + `', '` + doc.data().type + `')">REMOVE ITEM</button>` +
                                    `</span>` +
                                    `<div>` + doc.data().description + `</div>` +
                                    `</div></div><br><br>`;
                            } else {
                                menuDisplay.innerHTML += `<div class="menuBox"><div class="boxes basic-div border-solid"></div><div class="basic-div flex-direction-column menuItem"><span>` +
                                    doc.data().name + " " + "$" +
                                    doc.data().price + " " +
                                    `<button type="button" class="itemButton" onclick="Cart.addItemToCart('` + doc.data().name + `', '` + doc.data().type + `')">&nbsp;+&nbsp;</button>` +
                                    `</span>` +
                                    `<div>` + doc.data().description + `</div>` +
                                    `</div></div><br><br>`;
                            }
                        });
                    })
            }
        });
    },

    removeMenuItem(item, itemType) {
        itemRef.collection(itemType).doc(item).delete().then(() => {
            console.log("Document successfully deleted!");
            location.reload();
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
}

//Get menu items from Firestore when the page loads
//window.onload = Menu.getAllMenuItems();

//Get the correct menu when the page loads
window.onload = updateSpecificMenu(window.location.href);

function updateSpecificMenu(menuType) {
    //Find which menu the user is currently looking at
    //This is the Pizza menu
    if (menuType.includes("pizzaPageIndex")) {
        Menu.getMenuItemsFrom("Pizza");
        console.log("You're on the Pizza Page");
        console.log(menuType);
    }
    //This is the Drinks menu
    if (menuType.includes("drinksPageIndex")) {
        Menu.getMenuItemsFrom("Drinks");
        console.log("You're on the Drinks Page");
        console.log(menuType);
    }
    //This is the Desserts menu
    if (menuType.includes("dessertsPageIndex")) {
        Menu.getMenuItemsFrom("Desserts");
        console.log("You're on the Desserts Page");
        console.log(menuType);
    }
    //This is the Sides menu
    if (menuType.includes("sidesPageIndex")) {
        Menu.getMenuItemsFrom("Sides");
        console.log("You're on the Sides Page");
        console.log(menuType);
    }
}