/*Cart System*/
var firestore = firebase.firestore();
var userRef = firestore.collection("users");

/******* USE var userID = firebase.auth().currentUser.uid; *******/
//var userID = firebase.auth().currentUser.uid;
var userID = "tempkey";
/******* DO NOT USE var userID = "tempkey" *******/

var userDocID = '';
var cartTotal = document.querySelector(".total");
var cartDisplay = document.querySelector(".cart");
var totalPrice = document.querySelector(".totalPrice");

//This function updates current changes to the cart
function updateCart() {

    itemInCart = 'Cart';

    //Look for the document id that corresponds to the user's id
    userRef.where("UID", "==", userID)
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                userDocID = doc.id;
                console.log(userDocID, " => ", doc.data());
            });

            //Find the Cart collection, read it, and display it OR add a Cart if it doesn't exist
            userRef.doc(userDocID).collection("Cart")
                .onSnapshot((querySnapshot) => {

                    itemInCart = 'Cart';
                    cartDisplay.innerHTML = itemInCart;

                    querySnapshot.forEach((doc) => {
                        if (doc.id != 'Total') {
                            //Insert HTML element displaying current Cart data
                            itemInCart += `<span>` +
                                doc.data().itemname + " " +
                                doc.data().price + " " +
                                doc.data().quantity +
                                `<span>` + " " +
                                `<button type="button" class="itemButton" onclick="Cart.removeItemFromCart('` + doc.data().itemname + `')">-</button>` +
                                `<br><br>`
                            cartDisplay.innerHTML = itemInCart;
                        } else {
                            //Insert HTML element displaying current Total
                            totalAmount = doc.data().total;
                            if (totalAmount <= 0)
                                totalAmount = 0

                            cartDisplay.innerHTML += `<div class="total"><span class="totalPrice">` +
                                `Total: $` + totalAmount.toFixed(2) + `</span></div>`;
                        }
                    })
                });
        })
}

//Automatically call a cart update whenever a change in the Cart data occurs
getRealtimeUpdates = updateCart();

//Cart Object that controls any changes to the Cart data
var Cart = {
    //Fixed menu list (should be dynamic in final version)
    menuItem: document.querySelectorAll(".menuItem"),

    addItemToCart: function(index) {

        var userID = "tempkey";
        var userDocID = '';

        //Get specific menu item from list
        parseInt(index);
        var itemName = Cart.menuItem[index].children[0].innerHTML;
        var itemPrice = Cart.menuItem[index].children[1].innerHTML;

        //Remove $ from itemPrice string
        itemPrice = itemPrice.substring(1);

        //add item price to total, and format
        itemPrice = parseFloat(itemPrice, 10);

        //Look for the document id that corresponds to the user's id
        userRef.where("UID", "==", userID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    userDocID = doc.id;
                    console.log(userDocID, " => ", doc.data());

                    if (userDocID != '') {

                        var cartRef = userRef.doc(userDocID).collection("Cart");
                        var quantity = 1; //default quantity if item isn't in Cart
                        var finalPrice = 0;

                        cartRef.doc(itemName).get().then((doc) => {
                            //Increase the quantity if item is already in Cart
                            if (doc.exists) {
                                quantity = doc.data().quantity + 1;
                            }
                            //Add the item to the Cart
                            cartRef.doc(itemName).set({
                                    itemname: itemName,
                                    price: itemPrice,
                                    quantity: quantity
                                })
                                .then(() => {
                                    console.log("Document successfully written!");
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                        })

                        cartRef.doc('Total').get().then((doc) => {
                            //Add to the current total
                            if (doc.exists) {
                                finalPrice = doc.data().total + itemPrice;
                            } else {
                                finalPrice = itemPrice;
                            }
                            //Write current Total to firestore
                            cartRef.doc('Total').set({
                                    total: finalPrice
                                })
                                .then(() => {
                                    console.log("Document successfully written!");
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                        })
                    }
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    },

    removeItemFromCart: function(item) {

        //Look for the document id that corresponds to the user's id
        userRef.where("UID", "==", userID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    userDocID = doc.id;
                    console.log(userDocID, " => ", doc.data());

                    if (userDocID != '') {

                        var cartRef = userRef.doc(userDocID).collection("Cart");
                        var quantity;
                        var finalPrice = 0;

                        userRef.doc(userDocID).collection("Cart").doc(item).get().then((doc) => {
                            itemName = doc.data().itemname;
                            itemPrice = doc.data().price;

                            //Remove item from Cart in firestore (since subtracting 1 from 1 would be 0)
                            if (doc.data().quantity == 1) {
                                cartRef.doc(item).delete().then(() => {
                                    console.log("Document successfully deleted!");
                                }).catch((error) => {
                                    console.error("Error removing document: ", error);
                                });
                            }
                            if (doc.data().quantity > 1) {
                                //Decrease the quantity if item is already in Cart
                                quantity = doc.data().quantity - 1;
                                //Write to Cart with updated quantity
                                cartRef.doc(item).set({
                                        itemname: itemName,
                                        price: itemPrice,
                                        quantity: quantity
                                    })
                                    .then(() => {
                                        console.log("Document successfully written!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                            }
                        })

                        userRef.doc(userDocID).collection("Cart").doc('Total').get().then((doc) => {
                            //Subtract from current Total
                            if (doc.exists) {
                                finalPrice = doc.data().total - itemPrice;
                            } else {
                                finalPrice = itemPrice;
                            }
                            //Write current Total to firestore
                            cartRef.doc('Total').set({
                                    total: finalPrice
                                })
                                .then(() => {
                                    console.log("Document successfully written!");
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                        })
                    }
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
};

//Fixed menu with preset indexes
Cart.menuItem[0].addEventListener('click', function() { Cart.addItemToCart('0') });
Cart.menuItem[1].addEventListener('click', function() { Cart.addItemToCart('1') });
Cart.menuItem[2].addEventListener('click', function() { Cart.addItemToCart('2') });
Cart.menuItem[3].addEventListener('click', function() { Cart.addItemToCart('3') });
Cart.menuItem[4].addEventListener('click', function() { Cart.addItemToCart('4') });