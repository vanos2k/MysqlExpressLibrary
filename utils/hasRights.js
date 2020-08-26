module.exports = (req, id) => {
    return req.session.user && (req.session.user.status === 1 || req.session.user.id === id);
};