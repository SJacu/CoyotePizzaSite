let currentUser = "Error";
var userDoc;
const form = document.querySelector(".box");
const totalPoints = document.querySelector("#total");
const email = document.querySelector("#email");
const cardPayment = document.querySelector("#cardPayment");
const phone = document.querySelector("#phone");
const bAddress = document.querySelector("#bAddress");
const EditButtonHolder = document.querySelector("#edit");
const EditButton = document.querySelector("#editButton");

//listen for auth status changes, returns user if user is considered "logged in"
auth.onAuthStateChanged(user =>
{
    if(user)
    {       
        currentUser = user.uid;
        //firestore looks through users documents untill it finds a document with a matching UID as the user logged in
        db.collection("users").where("UID", "==", user.uid).get().then((querySnapshot) =>
        {
            querySnapshot.forEach((doc) =>
            {
                //doc.data() is never undefined for query doc snapshots
                userDoc = doc;
                totalPoints.textContent = "Total Rewards: " + doc.data().points;
                email.textContent = "Email: " + doc.data().email;
                cardPayment.textContent = "Card Payment: " + doc.data().cardNumber;
                phone.textContent = "Phone: " + doc.data().Phone;
                bAddress.textContent = "Billing Address: " + doc.data().billAddress;
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }else{
        window.location.href = "../index.html";
    }
});

//adjusts profile screen to make all text feilds editable
function Edit()
{
    //card field
    input1 = document.createElement("input");
    cardPayment.textContent = "Card Payment: "
    input1.id = "cardInput";
    input1.placeholder = userDoc.data().cardNumber;
    cardPayment.appendChild(input1);

    //phone number field
    input2 = document.createElement("input");
    phone.textContent = "Phone: "
    input2.id = "phoneInput";
    input2.placeholder = userDoc.data().Phone;
    phone.appendChild(input2);

    //card field
    input3 = document.createElement("input");
    bAddress.textContent = "Billing Address: "
    input3.id = "billingInput";
    input3.placeholder = userDoc.data().billAddress;
    bAddress.appendChild(input3);

    //turns the edit button into a "done" button
    EditButtonHolder.textContent = "";
    button = document.createElement("a");
    button.id = "editButton"
    button.textContent = "Done";
    button.addEventListener("click", (e) =>
    {
        e.preventDefault();
        Done();
    });
    EditButtonHolder.appendChild(button);
}
EditButton.addEventListener("click", (e) =>
{
    e.preventDefault();
    Edit();
});

//update the user's information
function Done()
{
    let tempPhone = ""
    //if there's no change in the card info, put it into the value
    let cardInput = document.getElementById("cardInput");
    if(cardInput.value == "")
    {
        cardInput.value = cardInput.placeholder;
    }

    //if there's no change in the phone info, put it into value
    let phoneInput = document.getElementById("phoneInput");
    if(phoneInput.value == "")
    {
        phoneInput.value = phoneInput.placeholder;
        tempPhone = phoneInput.value;
    }else{
        tempPhone = "(" + phoneInput.value.slice(0,3) + ") " + phoneInput.value.slice(3,6) + "-" + phoneInput.value.slice(6);
    }

    //if there's no change in the billing info, put it into value
    let billingInput = document.getElementById("billingInput");
    if(billingInput.value == "")
    {
        billingInput.value = billingInput.placeholder;
    }

    //Update the user profile's document
    db.collection('users').doc(userDoc.id).set(
    {
        cardNumber: cardInput.value,
        Phone: tempPhone,
        billAddress: billingInput.value
    }, { merge: true })
    .then(() => {

        //updates the in-page user document
        db.collection("users").where("UID", "==", currentUser).get().then((querySnapshot) =>
        {
            querySnapshot.forEach((doc) =>
            {
                //update userDoc and display it on the profile.
                userDoc = doc;
                cardPayment.textContent = "Card Payment: " + doc.data().cardNumber;
                phone.textContent = "Phone: " + doc.data().Phone;
                bAddress.textContent = "Billing Address: " + doc.data().billAddress;
            });
        })
        .catch((error) => {
            console.log("Error getting document: ", error);
        });

        EditButtonHolder.textContent = "";
        button = document.createElement("a");
        button.id = "editButton"
        button.textContent = "Edit";
        button.addEventListener("click", (e) =>
        {
            e.preventDefault();
            Edit();
        });
        EditButtonHolder.appendChild(button);
        alert("Profile succesfully updated");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}