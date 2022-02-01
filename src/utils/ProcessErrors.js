export default (error) => {
     console.log(error);

     switch (error.code) {
          case "auth/internal-error":
               return "Data is invalid, If this error persist, make sure to contact us.";
          case "auth/invalid-email":
               return "Email is not well formatted.";
          case "auth/weak-password":
               return "Password should be at least 6 characters.";
          case "auth/email-already-in-use":
               return "Email is already in use.";
          default:
               "Something went wrong...";
     }
};
