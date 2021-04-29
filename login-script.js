// login-script.js
// https://www.youtube.com/watch?v=4d-gIPGzmK4&list=PL4cUxeGkcC9itfjle0ji1xOZ2cjRGY_WB&ab_channel=TheNetNinja
// https://www.youtube.com/watch?v=aN1LnNq4z54&list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ&ab_channel=TheNetNinja            

//login information
const LoginEmail = document.querySelector("#loginmodalEmail");
const LoginPassword = document.querySelector("#loginmodalPassword");
const Login = document.querySelector("#loginmodal");

//navbar information
const UserDisplay = document.querySelector("#welcome");
const NavLogin = document.querySelector("#login");
const NavLogout = document.querySelector("#logout");
const EditItem = document.querySelector("#editMenu");

//REEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
function hideLoginSignup()
{
    document.querySelector(".loginSignup").style.display = 'none';
}

//listen for auth status changes, returns user if user is considered "logged in"
auth.onAuthStateChanged(user =>
{
    if(user)
    {
        hideLoginSignup();
        //user is logged in
        console.log("There is a user logged in");
        NavLogin.style.display = "none";

        //firestore looks through users documents untill it finds a document with a matching UID as the user logged in
        db.collection("users").where("UID", "==", user.uid).get().then((querySnapshot) =>
        {
            querySnapshot.forEach((doc) =>
            {
                // doc.data() is never undefined for query doc snapshots
                let newA = document.createElement("a");
                newA.className = "navlink";
                newA.href = document.location.origin + "/Profile/profile.html";
                newA.textContent = "Welcome, " + doc.data().username;
                UserDisplay.appendChild(newA);
                if (doc.data().admin == true)
                {
                    if (EditItem)
                    {
                        EditItem.style.display = "inline-block";
                    }
                }
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }
    else
    {
        if (EditItem)
        {
            EditItem.style.display = "none";
        }
        hideLoginSignup();
        //user is logged out
        console.log("There is no user logged in");
        UserDisplay.textContent = "";
        NavLogout.style.display = "none";
    }
});

//function will use firebase auth to log the user out
function Log_Out() {
    auth.signOut();
}

//attaches logout function to logout button on page
logout.addEventListener("click", (e) => {
    Log_Out();
    location.reload();
});

//function to log in user
function Log_In()
{
    //can use squarebracket notation for a form object
    const email = LoginEmail.value;
    const password = LoginPassword.value;

    //if both forms have data inside of them
    if ((email != "") && (password != ""))
    {
        //basic sign-in method
        auth.signInWithEmailAndPassword(email, password).then(cred =>
        {
            //clears information forms
            LoginEmail.value = "";
            LoginPassword.value = "";
            alert("Logged In Successfully");
            hideLoginSignup();
            window.location.href = window.location.pathname;
        });
    }
    else
    {
        //if one of the forms are empty
        alert("Please fill in all login information!");
    }
}

Login.addEventListener("click", (e) =>
{
    e.preventDefault();
    Log_In();
});