/*Menu Items*/
var firestore = firebase.firestore();
var itemRef = firestore.doc("items/menuitems");

var Menu = {
    //Read menu item properties from input
    itemType: document.querySelector(".itemtype"),
    itemName: document.querySelector(".itemname"),
    itemPrice: document.querySelector(".itemprice"),
    description: document.querySelector(".description"),
    imgUploadButton: document.querySelector("#imgUpload"),
    menuDisplay: document.querySelector(".menu"), //Most likley not needed

    addMenuItems: function() {
        //Write menu item properties to firestore
        if (this.itemName.value == '' || this.itemPrice.value == '' || this.description.value == '' || this.imgUploadButton.files[0] == null) {
            alert('DO NOT LEAVE ANY FIELDS BLANK');
            return;
        }

        itemName = this.itemName.value;
        itemType = this.itemType.value;
        itemPrice = parseFloat(this.itemPrice.value, 10);
        description = this.description.value;
        imgFileLocation = 'images/' + this.imgUploadButton.files[0].name;
        /*
        if (this.imgUploadButton.files[0].name.includes(".")) {
            alert("invalid file name");
            return;
        }*/


        //Write menu item properties to Firestore
        itemRef.collection(itemType).doc(itemName).set({
                name: itemName,
                price: itemPrice,
                description: description,
                type: itemType,
                img: imgFileLocation
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
                            storage.ref(doc.data().img).getDownloadURL()
                                .then((url) => {
                                    //Add HTML Element for each menu item w/ add button
                                    removeSpaces = doc.data().name.split(" ").join("");
                                    className = removeSpaces.split("()_-,").join("");
                                    menuDisplay.innerHTML += `<div class="menuBox"><div class="boxes basic-div border-solid"><img class="` + className + `" src="" alt="" height="200px" width="250px"></div><div class="basic-div flex-direction-column menuItem"><span>` +
                                        doc.data().name + " " + "$" +
                                        doc.data().price + " " +
                                        `<button type="button" class="itemButton" onclick="Cart.addItemToCart('` + doc.data().name + `', '` + doc.data().type + `')">&nbsp;+&nbsp;</button>` +
                                        `</span>` +
                                        `<div>` + doc.data().description + `</div>` +
                                        `</div></div><br><br>`;
                                    imgBox = document.querySelector('.' + className);
                                    imgBox.setAttribute('src', url);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
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
                                storage.ref(doc.data().img).getDownloadURL()
                                    .then((url) => {
                                        removeSpaces = doc.data().name.split(" ").join("");
                                        className = removeSpaces.split("()_-,").join("");
                                        menuDisplay.innerHTML += `<div class="menuBox"><div class="boxes basic-div border-solid"><img class="` + className + `" src="" alt="" height="200px" width="250px"></div><div class="basic-div flex-direction-column menuItem"><span>` +
                                            doc.data().name + " " + "$" +
                                            doc.data().price + " " +
                                            `<button type="button" class="itemButton" onclick="Cart.addItemToCart('` + doc.data().name + `', '` + doc.data().type + `')">&nbsp;+&nbsp;</button>` +
                                            `<br><button type="button" class="itemButton" onclick="Menu.removeMenuItem('` + doc.data().name + `', '` + doc.data().type + `')">REMOVE ITEM</button>` +
                                            `</span>` +
                                            `<div>` + doc.data().description + `</div>` +
                                            `</div></div><br><br>`;

                                        imgBox = document.querySelector('.' + className);
                                        imgBox.setAttribute('src', url);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            } else {
                                storage.ref(doc.data().img).getDownloadURL()
                                    .then((url) => {
                                        removeSpaces = doc.data().name.split(" ").join("");
                                        className = removeSpaces.split("()_-,").join("");
                                        menuDisplay.innerHTML += `<div class="menuBox"><div class="boxes basic-div border-solid"><img class="` + className + `" src="" alt="" height="200px" width="250px"></div><div class="basic-div flex-direction-column menuItem"><span>` +
                                            doc.data().name + " " + "$" +
                                            doc.data().price + " " +
                                            `<button type="button" class="itemButton" onclick="Cart.addItemToCart('` + doc.data().name + `', '` + doc.data().type + `')">&nbsp;+&nbsp;</button>` +
                                            `</span>` +
                                            `<div>` + doc.data().description + `</div>` +
                                            `</div></div><br><br>`;
                                        imgBox = document.querySelector('.' + className);
                                        imgBox.setAttribute('src', url);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });

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
//window.onload = updateSpecificMenu(window.location.href);
document.addEventListener("DOMContentLoaded", () => {
    updateSpecificMenu(window.location.href);
});

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

var imgUploadButton = document.querySelector("#imgUpload");
if (imgUploadButton) {
    imgUploadButton.addEventListener('change', function(e) {
        var file = e.target.files[0];
        var storageRef = storage.ref('images/' + file.name);
        storageRef.put(file);
        console.log(imgUploadButton.files[0].name);
    });
}