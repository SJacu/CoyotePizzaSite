// sign-up-script.js
// https://www.youtube.com/watch?v=4d-gIPGzmK4&list=PL4cUxeGkcC9itfjle0ji1xOZ2cjRGY_WB&ab_channel=TheNetNinja
// https://www.youtube.com/watch?v=aN1LnNq4z54&list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ&ab_channel=TheNetNinja            

//sign-up informaiton
const signUpUsername = document.querySelector("#signUpUserName");
const signUpEmailInput = document.querySelector("#signUpEmail");
const signUpPasswordInput = document.querySelector("#signUpPassword");
const signUpPasswordInput2 = document.querySelector("#signUpReenterPassword");
const signUpButton = document.querySelector("#createAccount");

//login information
const LoginEmail = document.querySelector("#loginEmail");
const LoginPassword = document.querySelector("#loginPassword");
const SignUpLogin = document.querySelector("#signupinfoLogin");

//navbar information
const UserDisplay = document.querySelector("#welcome");

//listen for auth status changes, returns user if user is considered "logged in"
auth.onAuthStateChanged(user => {
    if(user)
    {
        //user is logged in
        console.log("There is a user logged in");
        UserDisplay.textContent = "Welcome, " + user.email;
    }else{
        //user is logged out
        console.log("There is no user logged in");
    }
});

//function to sign up the user
function Sign_Up()
{
    //can use squarebracket notation for a form object
    const userName = signUpUsername.value;
    const email = signUpEmailInput.value;
    const password = signUpPasswordInput.value;
    const passwordConfirm = signUpPasswordInput2.value;
    if(password == passwordConfirm)
    {
        //if both feilds have informatoin inside of them, and the password is of proper length:
        if((email != "")&&(password != "")&&(password.length >= 6))
        {
            //uses basic firebase auth sign-up method.
            auth.createUserWithEmailAndPassword(email, password).then(cred =>
            {
                userID = cred.user.uid;
                Create_User(userID, userName, email);
            });
        }
        else if(password.length < 6) //if password is not of proper length
        {
            alert("Password must more than 6 characters!");
        }else{
            //if either form is not filled in
            alert("Please fill in all login information!");
        }
    }else{
        alert("Passwords do not match.");
    }   
}

function Create_User(uID, useNam, email)
{
    let today = new Date();
    let date = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
    db.collection("users").add(
    {
        UID: uID,
        username: useNam,
        email: email,
        dateJoined: date,
        admin: false,
        points: 0,
        cardNumber: "Not set yet.",
        cardName: "Not set yet.",
        cardExp: "Not set yet",
        cardSec: "Not set yet",
        Phone: "Not set yet.",
        billAddress: "Not set yet.",
        billCity: "Not set yet.",
        billZip: "Not set yet."
    }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        //clear input feilds from Sign_Up;
        signUpEmailInput.value = "";
        signUpPasswordInput.value = "";
        signUpPasswordInput2.value = "";
        window.location.href = "../index.html";
        alert("Signed up Succesffuly");
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
}

//attaches our sign-up button to our sign up function
//Using default event (E) allows us to use the preventDefault method, which doens't make the page refresh every time somthing happens
signUpButton.addEventListener("click", (e) =>
{
    e.preventDefault();
    Sign_Up();
});

//function to log in user
function Log_In()
{
    //can use squarebracket notation for a form object
    const email = LoginEmail.value;
    const password = LoginPassword.value;

    //if both forms have data inside of them
    if((email != "")&&(password != ""))
    {
        //basic sign-in method
        auth.signInWithEmailAndPassword(email, password).then(cred =>
        {
            //clears information forms
            LoginEmail.value = "";
            LoginPassword.value = "";
            window.location.href = "../index.html";
            alert("Logged In Successfully");
        });
    }else{
        //if one of the forms are empty
        alert("Please fill in all login information!");
    }
}
SignUpLogin.addEventListener("click", (e) =>
{
    e.preventDefault();
    Log_In();
});
