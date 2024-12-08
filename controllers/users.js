
const User = require("../models/user.js");



module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
} 


module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = await new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        // automatically login
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings"); 
        })
       
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");  
}


module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    // res.redirect("/listings");

    // res.redirect(req.session.redirectUrl);  // ek bar login hone pr .authenticat(passport) koi bhi extra info(session info) store ki hogi use remove kr deta hai
    // res.redirect(res.locals.redirectUrl);

    let redirect1 = res.locals.redirectUrl || "/listings";
    res.redirect(redirect1);
}


module.exports.logout = async (req, res, next) => {
    // logout() by def. ek call_back leta hai
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged Out now");
        res.redirect("/listings");
    }); 
}