const Author = require('../models/author');
const {validationResult} = require('express-validator');
const slugify = require('slugify');
const hasRightsFunction = require('../utils/hasRights');

exports.getAuthors = async (req, res) => {
    const authors = await Author.findAll();
    res.render('author/author-list', {
        title: 'Authors page',
        authors
    });
};

exports.getAuthor = async (req, res) => {
    const author = await Author.findOne({where: {slug: req.params.slug}});
    const hasRights = hasRightsFunction(req, author.creatorId);

    res.render('author/author-detail', {
        title: `${author.name} ${author.surname} page`,
        hasRights,
        author
    });
};


exports.getAddAuthor = (req, res) => {
    res.render('author/add-author', {
        title: 'Author add page',
        error: req.flash('error')
    });
};

exports.postAddAuthor = async (req, res) => {
    const {name, surname, image} = req.body;
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.status(422).redirect('/author/add');
        }
        const author = await Author.create({
            name,
            surname,
            image,
            creatorId: req.session.user.id,
            slug: slugify(Author.fullName(name, surname))
        });

        res.redirect(`/author/${author.id}`);
    } catch (e) {
        console.log(e);
    }
};

exports.getEditAuthor = async (req, res) => {
    try {
        const author = await Author.findOne({where: {slug: req.params.slug}});

        const hasRights = hasRightsFunction(req, author.creatorId);
        if (!hasRights) {
            return res.status(403).redirect('/author');
        }

        res.render('author/edit-author', {
            title: `Editing ${author.fullName()}`,
            error: req.flash('error'),
            author
        });
    } catch (e) {
        console.log(e);
    }
};

exports.postEditAuthor = async (req, res) => {
    const {name, surname, image, about, authorSlug} = req.body;
    const errors = validationResult(req);

    try {

        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.status(422).redirect(`/author/${authorSlug}/edit`);
        }

        const newSlug = slugify(Author.fullName(name, surname));

        await Author.update({
            name, surname, about, image, slug: newSlug
        }, {
            where: {slug: authorSlug}
        });

        res.redirect(`/author/${newSlug}`);
    } catch (e) {
        console.log(e);
    }
};

exports.postDeleteAuthor = async (req, res) => {
    const author = await Author.findOne({where: {slug: req.params.slug}});
    const hasRights = hasRightsFunction(req, author.creatorId);
    if (!hasRights) {
        return res.status(403).redirect('/authors');
    }

    await Author.destroy({where: {slug: req.params.slug}});
    res.redirect('/author');
};
