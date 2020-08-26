const bcrypt = require('bcrypt');
const User = require('../models/user');
const {validationResult} = require('express-validator');

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        title: 'Login page',
        error: req.flash('error')
    });
};

exports.postLogin = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({where: {email: email}});

        if (!user) {
            req.flash('error', 'Wrong email');
            return res.status(422).redirect('/auth/login');
        }

        if (!(await bcrypt.compare(password, user.password))) {
            req.flash('error', `Password wrong`);
            return res.status(422).redirect('/auth/login');
        }

        req.session.isAuthenticated = true;
        req.session.user = user;
        req.session.save(err => {
           if (err) throw err;
            res.redirect('/');
        });
    } catch (e) {
        console.log(e);
    }
};

exports.getRegister = (req, res) => {
    res.render('auth/register', {
        title: 'Register page',
        error: req.flash('registerError')
    });
};

exports.postRegister = async (req, res) => {
    const {password, email, username} = req.body;

    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = User.create({email: email, password: hashedPassword, status: 0, username: username});

        res.redirect('/auth/login');
    } catch (e) {
        console.log(e);
    }
};

exports.getLogout = (req, res) => {
    req.session.destroy(() => {
       res.redirect('/auth/login');
    });
};

