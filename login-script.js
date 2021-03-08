// login-script.js
// https://www.youtube.com/watch?v=4d-gIPGzmK4&list=PL4cUxeGkcC9itfjle0ji1xOZ2cjRGY_WB&ab_channel=TheNetNinja
// https://www.youtube.com/watch?v=aN1LnNq4z54&list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ&ab_channel=TheNetNinja            

//login information
const LoginEmail = document.querySelector("#loginEmail");
const LoginPassword = document.querySelector("#loginPassword");
const Login = document.querySelector("#loginmodal");

//navbar information
const UserDisplay = document.querySelector("#welcome");
const NavLogin = document.querySelector("#login");
const NavLogout = document.querySelector("#logout");

//REEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
function hideLoginSignup()
{
    document.querySelector(".loginSignup").style.display = 'none';
}

//listen for auth status changes, returns user if user is considered "logged in"
auth.onAuthStateChanged(user => {
    if(user)
    {
        //user is logged in
        console.log("There is a user logged in");
        UserDisplay.textContent = "Welcome, " + user.email;
        NavLogin.style.display = "none";
    }else{
        //user is logged out
        console.log("There is no user logged in");
        UserDisplay.textContent = "";
    }
});

//function will use firebase auth to log the user out
function Log_Out()
{
    auth.signOut();
}

//attaches logout function to logout button on page
logout.addEventListener("click", (e) =>
{
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
    if((email != "")&&(password != ""))
    {
        //basic sign-in method
        auth.signInWithEmailAndPassword(email, password).then(cred =>
        {
            //clears information forms
            LoginEmail.value = "";
            LoginPassword.value = "";
            alert("Logged In Successfully");
            hideLoginSignup();
        });
    }else{
        //if one of the forms are empty
        alert("Please fill in all login information!");
    }
}

Login.addEventListener("click", (e) =>
{
    e.preventDefault();
    Log_In();
});
