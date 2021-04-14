/*Menu Items*/
var itemRef = firestore.doc("items/menuitems");

var Menu = {
    //Read menu item properties from input
    itemType: document.querySelector(".itemtype"),
    itemName: document.querySelector(".itemname"),
    itemPrice: document.querySelector(".itemprice"),
    description: document.querySelector(".description"),
    menuDisplay: document.querySelector(".tempMenu"),

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

    getMenuItems: function() {
        //Find firestore Menu Items

        //Get All Pizzas
        itemRef.collection("Pizza").get()
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

        //Get All Sides
        itemRef.collection("Sides").get()
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

        //Get All Drinks
        itemRef.collection("Drinks").get()
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

        //Get All Desserts
        itemRef.collection("Desserts").get()
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

window.onload = Menu.getMenuItems();