module.exports = (req, res, next) => {
    res.locals.isAuth = req.session.isAuthenticated;
    res.locals.csrf = req.csrfToken();
    if (req.session.user) {
        res.locals.usernameAccOwner = req.session.user.username;
    }
    next();
};