const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

const userController = require("../controllers/users.js");



router.get("/signup", userController.renderSignupForm);

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student124@gmail.com",
//         username: "delta-student" 
//     });

//     let registerUser = await User.register(fakeUser, "helloWorld!");  // helloWorld! == password
//     res.send(registerUser);
// });
router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {  
        failureRedirect: "/login", 
        failureFlash: true  
    }),
    userController.login
);


router.get("/logout", userController.logout);



module.exports = router;

