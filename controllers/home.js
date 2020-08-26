exports.getMainPage = (req, res) => {
    res.render('home', {
        title: 'home page'
    })
};