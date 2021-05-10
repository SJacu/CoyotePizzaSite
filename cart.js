/*Cart System*/
var firestore = firebase.firestore();
var userRef = firestore.collection("users");

/******* USE var userID = firebase.auth().currentUser.uid; *******/
var user = firebase.auth().currentUser;
var userID = '';
//var userID = '';
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.  
        console.log(user);
        console.log(user.uid);
        updateCart(user.uid);
        userID = user.uid;

    } else {
        // No user is signed in.
    }
});
//var userID = firebase.auth().currentUser.uid;
//var userID = "tempkey";
/******* DO NOT USE var userID = "tempkey" *******/

var userDocID = '';
var cartTotal = document.querySelector(".total"); //I don't think this is used. Delete when confirmed
var cartDisplay = document.querySelector(".cart");
var totalPrice = document.querySelector(".totalPrice");
var orderCompleteTotal = document.querySelector(".orderTotal");

//This function updates current changes to the cart
function updateCart(userID) {

    itemInCart = '<h1>Cart</h1><h1>&nbsp;</h1>';
    if (cartDisplay) {
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

                        itemInCart = '<h1>Cart</h1><h1>&nbsp;</h1>';
                        cartDisplay.innerHTML = itemInCart;

                        querySnapshot.forEach((doc) => {
                            if (doc.id != 'Total') {
                                console.log(doc.data());
                                //Insert HTML element displaying current Cart data
                                itemInCart += `<span>` +
                                    doc.data().itemname + " $" +
                                    doc.data().price + " " +
                                    doc.data().quantity +
                                    `<span>` + " " +
                                    `<button type="button" class="itemButton" onclick="Cart.removeItemFromCart('` + doc.data().itemname + `')">&nbsp;-&nbsp;</button>` +
                                    `<br><br>`
                                cartDisplay.innerHTML = itemInCart;
                            }
                        })
                    });
                userRef.doc(userDocID).collection("Cart")
                    .onSnapshot((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            if (doc.id == 'Total') {
                                //Insert HTML element displaying current Total
                                totalAmount = doc.data().total;
                                if (totalAmount <= 0)
                                    totalAmount = 0;

                                cartDisplay.innerHTML += `<div class="total"><span class="totalPrice">` +
                                    `Total: $` + totalAmount.toFixed(2) + `</span></div>`;
                            }
                        })
                    });
            })
    }
    if (orderCompleteTotal) {
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
                        querySnapshot.forEach((doc) => {
                            if (doc.id == 'Total') {
                                //Insert HTML element displaying current Total
                                totalAmount = doc.data().total;
                                if (totalAmount <= 0)
                                    totalAmount = 0;

                                orderCompleteTotal.innerHTML = `Total: $` + totalAmount.toFixed(2) + `</span></div>`;
                            }
                        })
                    });

                userRef.doc(userDocID).collection("Cart").onSnapshot((snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        userRef.doc(userDocID).collection("Cart").doc(doc.id).delete()
                    })
                })


            })
    }
}

//Automatically call a cart update whenever a change in the Cart data occurs
//getRealtimeUpdates = updateCart();

//Cart Object that controls any changes to the Cart data
var Cart = {

    menuItem: document.querySelectorAll(".menuItem"),
    itemName: '',
    itemPrice: '',

    addItemToCart: function(itemname, itemtype) {

        //var userID = "tempkey";
        var userDocID = '';

        //Get specific menu item from list
        firestore.doc("items/menuitems" + "/" + itemtype + "/" + itemname).get()
            .then((doc) => {
                console.log(doc.data())
                this.itemName = doc.data().name;
                this.itemPrice = doc.data().price;

                //Add item price to total, and format
                this.itemPrice = parseFloat(this.itemPrice, 10);

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

                                cartRef.doc(this.itemName).get().then((doc) => {
                                    //Increase the quantity if item is already in Cart
                                    if (doc.exists) {
                                        quantity = doc.data().quantity + 1;
                                    }
                                    //Add the item to the Cart
                                    cartRef.doc(this.itemName).set({
                                            itemname: this.itemName,
                                            price: this.itemPrice,
                                            quantity: quantity
                                        })
                                        .then(() => {
                                            console.log("Document successfully written!");
                                            alert(this.itemName + " added to Cart");
                                        })
                                        .catch((error) => {
                                            console.error("Error writing document: ", error);
                                        });
                                })

                                cartRef.doc('Total').get().then((doc) => {
                                    //Add to the current total
                                    if (doc.exists) {
                                        finalPrice = doc.data().total + this.itemPrice;
                                    } else {
                                        finalPrice = this.itemPrice;
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
            })
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
                            this.itemPrice = doc.data().price;

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
                                        price: this.itemPrice,
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
                                finalPrice = doc.data().total - this.itemPrice;
                            } else {
                                finalPrice = this.itemPrice;
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