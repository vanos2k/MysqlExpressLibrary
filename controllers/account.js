const User = require('../models/user');

exports.getAccount = (req, res) => {
    res.render('account', {
        title: 'Your account settings',
        user: req.session.user,
        error: req.flash('error')
    });
};

exports.postAccount = async (req, res) => {
    const {name, about} = req.body;
    const userId = req.session.user.id;
    let image;

    try {
        if (req.file) {
            image = req.file.path;
        }

        await User.update({
            name, about, image: image
        }, {
            where: {id: userId}
        });

        req.session.user = await User.findByPk(userId);
        res.redirect('/');
    } catch (e) {
        console.log(e);
    }
};