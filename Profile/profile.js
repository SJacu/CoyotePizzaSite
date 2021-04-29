let currentUser = "Error";
const Somthing = document.querySelector("#loginmodalEmail");

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
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }
});