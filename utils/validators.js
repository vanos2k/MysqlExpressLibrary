const {body} = require('express-validator');
const Book = require('../models/book');
const Author = require('../models/author');
const User = require('../models/user');
const {Op} = require('sequelize');

exports.bookValidator = [
    body('title', 'Min length is 2 symbols')
        .isLength({min: 2})
        .custom(async (value) => {
            try {
                const isBook = await Book.findOne({where: {title: value}});
                if (isBook) {
                    return Promise.reject('Book with this title already exists');
                }
            } catch (e) {
                console.log(e);
            }
            return true;
        })
        .trim(),
    body('description').trim(),
    body('image')
        .isURL()
        .withMessage('Type in correct image url'),
    body('author')
        .custom((value) => {
            const splitedAuthor = value.split(' ');
            if (splitedAuthor.length < 2) {
                throw new Error('Author field must contains name and surname');
            }
            return true;
        })
];

exports.bookEditValidor = [
    body('title', 'Min length is 2 symbols')
        .isLength({min:2})
        .custom(async (value, {req}) => {
            try {
                const book = await Book.findOne({where: {title: value}});
                if (book.slug !== req.body.bookSlug) {
                    return Promise.reject('Book with this title already exists');
                }
            } catch (e) {
                console.log(e);
            }
        })
        .trim(),
    body('description').trim(),
    body('image')
        .isURL()
        .withMessage('Type in correct image url'),
    body('author')
        .custom((value) => {
            const splitedAuthor = value.split(' ');
            if (splitedAuthor.length < 2) {
                throw new Error('Author field must contains name and surname');
            }
            return true;
        })
];

exports.registerValidator = [
    body('email')
        .isEmail()
        .withMessage('Type in correct email')
        .custom(async (value) => {
            try {
                const user = await User.findOne({where: {email: value}});
                if (user) {
                    return Promise.reject('This email already registered');
                }
            } catch (e) {
                console.log(e);
            }
        })
        .trim(),
    body('username', 'Length must be at least 2 symbols')
        .isLength({min: 2})
        .custom(async (value) => {
            try {
                const user = await User.findOne({where: {'username': value}});

                if (user) {
                    return Promise.reject('This username already exists');
                }
            } catch (e) {
                console.log(e);
            }
        })
        .trim(),
    body('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 symbols')
        .trim(),
    body('repeat')
        .custom((value, {req}) => {
            if (value === req.body.password) {
                return true
            }
            return Promise.reject(`Passwords doesn't equals`)
        })
];

exports.loginValidator = [
    body('email').isEmail().withMessage('Type in correct email').trim(),
    body('password').trim()
];

exports.authorValidator = [
    body('name')
        .isLength({min:2})
        .isAlpha()
        .withMessage('Length must be at least 2 symbols')
        .custom(async (name, {req}) => {
            try {
                const surname = req.body.surname;

                const author = await Author.findOne({
                    where: {
                        [Op.or]: [{name: name, surname: surname}, {name: surname, surname: name}]
                    }
                });

                if (author) {
                    return Promise.reject(`Author ${author.name} ${author.surname} already exists`);
                }
            } catch (e) {
                console.log(e);
            }

        })
        .trim(),
    body('surname').isLength({min:2}).isAlpha().withMessage('Length must be at least 2 symbols').trim(),
    body('image').isURL().withMessage('Type in correct url'),
];

exports.authorEditValidator = [
    body('name').isLength({min:2}).isAlpha().withMessage('Length must be at least 2 symbols').trim(),
    body('surname').isLength({min:2}).isAlpha().withMessage('Length must be at least 2 symbols').trim(),
    body('image').isURL().withMessage('Type in correct url'),
];

// exports.accountValidator = [];