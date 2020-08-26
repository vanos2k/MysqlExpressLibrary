module.exports = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        res.redirect('/auth/login');
    }

    next()
};