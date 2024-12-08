
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); 
const passport = require("passport");
const LocalStrategy = require("passport-local");

//models
const User = require("./models/user.js");

//requiring the routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express(); 

const dbUrl = process.env.ATLASDB_URL;

// MongoDB connection
async function main() {
    try {
        // await mongoose.connect(`mongodb://127.0.0.1:27017/Airbnb`);
        await mongoose.connect(dbUrl);
        console.log("MongoDB connection successful");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }
}

main();

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));




const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }, 
};

// app.use(cookieParser());

// LEARNING COOKIES-PARSER 
// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste");
//     res.cookie("madeIn", "India");
//     res.send("sent you some cookies");
// });

// Default Routes
// app.get("/", (req, res) => {
//     // console.dir(req.cookies);
//     res.send("Airbnb is working");
// });

app.use(session(sessionOptions));
app.use(flash());

// session k ander he passport use hoga
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate() ));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    res.locals.currUser = req.user;
    next();    
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong!" } = err;
    res.render("error.ejs", { err });
});


// Start Server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});


