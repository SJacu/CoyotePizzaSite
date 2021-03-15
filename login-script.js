// login-script.js
// https://www.youtube.com/watch?v=4d-gIPGzmK4&list=PL4cUxeGkcC9itfjle0ji1xOZ2cjRGY_WB&ab_channel=TheNetNinja
// https://www.youtube.com/watch?v=aN1LnNq4z54&list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ&ab_channel=TheNetNinja            

<<<<<<< Updated upstream

const loginBar;
const signUp;
const logout;
const login;
const submitData;
const username;    
=======
//login information
const LoginEmail = document.querySelector(".loginEmail");
const LoginPassword = document.querySelector(".loginPassword");
const Login = document.querySelector("#loginmodal");

//navbar information
const UserDisplay = document.querySelector("#welcome");
const NavLogin = document.querySelector("#login");
const NavLogout = document.querySelector("#logout");

//REEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
function hideLoginSignup() {
    document.querySelector(".loginSignup").style.display = 'none';
}
>>>>>>> Stashed changes

//listen for auth status changes, returns user if user is considered "logged in"
auth.onAuthStateChanged(user => {
    if (user) {
        //user is logged in
<<<<<<< Updated upstream

    }else{
=======
        console.log("There is a user logged in");
        UserDisplay.textContent = "Welcome, " + user.email;
        NavLogin.style.display = "none";
    } else {
>>>>>>> Stashed changes
        //user is logged out

    }
});

//function to sign up the user
function Sign_Up()
{
    //can use squarebracket notation for a form object
    const email;
    const password;

    //if both feilds have informatoin inside of them, and the password is of proper length:
    if((email != "")&&(password != "")&&(password.length >= 6))
    {
        //uses basic firebase auth sign-up method.
        auth.createUserWithEmailAndPassword(email, password).then(cred =>
        {
            //clear input feilds

        });
    }
    else if(password.length < 6) //if password is not of proper length
    {
        alert("Password must more than 6 characters!");
    }else{
        //if either form is not filled in
        alert("Please fill in all login information!");
    }
}
//attaches our sign-up button to our sign up function
//Using default event (E) allows us to use the preventDefault method, which doens't make the page refresh every time somthing happens
signUp.addEventListener("click", (e) =>
{
    e.preventDefault();
    Sign_Up();
});


//function will use firebase auth to log the user out
function Log_Out() {
    auth.signOut();
}

//attaches logout function to logout button on page
<<<<<<< Updated upstream
logout.addEventListener("click", (e) =>
{
    e.preventDefault();
=======
logout.addEventListener("click", (e) => {
>>>>>>> Stashed changes
    Log_Out();
});

//function to log in user
function Log_In() {
    //can use squarebracket notation for a form object
    const email;
    const password;

    //if both forms have data inside of them
    if ((email != "") && (password != "")) {
        //basic sign-in method
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            //clears information forms
        });
    } else {
        //if one of the forms are empty
        alert("Please fill in all login information!");
    }
}
<<<<<<< Updated upstream
login.addEventListener("click", (e) =>
{
=======

Login.addEventListener("click", (e) => {
>>>>>>> Stashed changes
    e.preventDefault();
    Log_In();
});