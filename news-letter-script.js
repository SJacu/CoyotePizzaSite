const emailInput = document.querySelector("#newsletterEmail");
const newsLetterSubmitButton = document.querySelector("#newsletterSubmitButton");

auth.onAuthStateChanged(user =>
{
    if(user)
    {
        emailInput.placeholder = user.email;
    }
});

function submitEmailNewsLetter()
{
    //if there is no input in the newsletter box
    if(emailInput.value === "" && emailInput.placeholder === "EMAIL")
    {
        alert("Please insert an email.");
    }

    //if the user input somthing into the box:
    else if(emailInput.value != "" && emailInput.placeholder === "EMAIL")
    {
        let submitEmail = emailInput.value;

        //check if the email already exists in the database
        db.collection("newsLetter").where("email", "==", submitEmail).get().then((querySnapshot) =>
        {
            //if a document exists logging the entered email adress
            if(querySnapshot.size > 0)
            {
                alert("Email already signed up for the news letter!");
            }else{
                //if the email does not exist in the databse, process and add the email
                Process_Email(submitEmail);
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    //if the user is logged in but didn't type in an email
    else if(emailInput.value == "" & emailInput.placeholder != "EMAIL")
    {
        let submitEmail = emailInput.placeholder;

        //check if the email already exists in the database
        db.collection("newsLetter").where("email", "==", submitEmail).get().then((querySnapshot) =>
        {
            //if a document exists logging the entered email adress
            if(querySnapshot.size > 0)
            {
                alert("Email already signed up for the news letter!");
            }else{
                //if the email does not exist in the databse, process and add the email
                Process_Email(submitEmail);
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    //if the user is logged in but typed in a different email
    else if(emailInput.value != "" & emailInput.placeholder != "EMAIL")
    {
        let submitEmail = emailInput.placeholder;

        //check if the email already exists in the database
        db.collection("newsLetter").where("email", "==", submitEmail).get().then((querySnapshot) =>
        {
            //if a document exists logging the entered email adress
            if(querySnapshot.size > 0)
            {
                alert("Email already signed up for the news letter!");
            }else{
                //if the email does not exist in the databse, process and add the email
                Process_Email(submitEmail);
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }
}

function Process_Email(submitEmail)
{
    let indexcheck1 = submitEmail.search("@");
    let indexcheck2 = -1;

    //check to see there is an @ sign in the email
    if(indexcheck1 != -1)
    {
        indexcheck2 = submitEmail.search(".com");
    }

    //loop through possible email endings
    if(indexcheck2 === -1)
    {
        indexcheck2 = submitEmail.search(".net");
    }
    if(indexcheck2 === -1)
    {
        indexcheck2 = submitEmail.search(".gov");
    }
    if(indexcheck2 === -1)
    {
        indexcheck2 = submitEmail.search(".edu");
    }

    //user has inserted "valid" email
    if(indexcheck2 > indexcheck1)
    {
        db.collection("newsLetter").add(
        {
            email: submitEmail
        }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            
            //clear input feilds from newsletter;
            emailInput.value = "";
            alert("Thank you for signing up to our newsletter!");
        }).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }else{
        alert("Please insert a valid email adress!");
    }
}

newsLetterSubmitButton.addEventListener("click", (e) =>
{
    e.preventDefault();
    submitEmailNewsLetter();
});