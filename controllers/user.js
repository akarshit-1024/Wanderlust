const User = require('../models/user.js');

module.exports.signUpForm=(req, res) => {
    res.render("./user/signup.ejs");
};

module.exports.newUserLogIn=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Now you are logIn !");
            return res.redirect("/listinges");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};
module.exports.logInForm=(req, res) => {
    res.render("./user/login.ejs");
};

module.exports.userLogIn=async (req, res) => {
        req.flash("success", "Welcome back!");
        let redirectUrl=res.locals.redirectUrl || "/listinges";
        res.redirect(redirectUrl); 

};
module.exports.userLogOut=(req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listinges");
    })
};