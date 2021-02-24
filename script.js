//Show Login/SignUp Modal
document.querySelector("#login").addEventListener("click", showLoginSignup)
document.querySelector('.loginSignup').addEventListener("click", showLoginSignup)

function showLoginSignup() {
    document.querySelector(".loginSignup").style.display = 'flex';
}

//Hide Login/SignUp Modal
document.body.addEventListener("click", hideLoginSignup, true)

function hideLoginSignup() {
    document.querySelector(".loginSignup").style.display = 'none';
}