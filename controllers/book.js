const Book = require('../models/book');
const Author = require('../models/author');
const Rating = require('../models/rating');
const slugify = require('slugify');
const {validationResult} = require('express-validator');
const hasRightsFunction = require('../utils/hasRights');

exports.getBooks = async (req, res) => {
    const books = await Book.findAll({include: Author});
    for (let i = 0, j = books.length; i < j; i++) {
        const newValue = await Book.applyTotalRating(books[i].id);
        Object.assign(books[i], {totalRating: newValue});
    }

    res.render('book/book-list', {
       title: 'Books list',
       books
    });
};

exports.getAddBook = (req, res) => {
    res.render('book/add-book', {
        title: 'Add book',
        error: req.flash('error')
    });
};

exports.postAddBook = async (req, res) => {
    const {title, description, image, author} = req.body;
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.status(422).redirect('/books/add');
        }

        let newAuthor = await Author.findOneRaw(author);

        if (!newAuthor) {
            newAuthor = await Author.createRaw(author, req);
        }

        const book = await Book.create({
            title,
            description,
            image,
            slug: slugify(title),
            authorId: newAuthor.id,
            creatorId: req.session.user.id
        });
        res.redirect(`/books/${book.slug}`);
    } catch (e) {
        console.log(e);
    }
};

exports.getBook = async (req, res) => {
    try {
        const book = await Book.findOne({where: {slug: req.params.slug}, include: Author});

        const hasRights = hasRightsFunction(req, book.creatorId);

        res.render('book/book-detail', {
            title: `${book.title}`,
            statusReadingList: Rating.statusOptions(),
            book: book,
            hasRights
        })
    } catch (e) {
        console.log(e);
    }
};

exports.getEditBook = async (req, res) => {
    try {
        const book = await Book.findOne({where: {slug: req.params.slug}, include: Author});

        const hasRights = hasRightsFunction(req, book.creatorId);
        if (!hasRights) {
            return res.status(403).redirect('/books');
        }

        res.render('book/edit-book', {
            title: `Editing ${book.title}`,
            error: req.flash('error'),
            book
        });
    } catch (e) {
        console.log(e);
    }
};

exports.postEditBook = async (req, res) => {
    const {title, description, image, author, bookSlug} = req.body;
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            console.log(errors);
            req.flash('error', errors.array()[0].msg);
            return res.status(422).redirect(`/books/${bookSlug}/edit`);
        }

        let newAuthor = await Author.findOneRaw(author);

        if (!newAuthor) {
            newAuthor = await Author.createRaw(author, req);
        }
        const newBookSlug = slugify(title);
        await Book.update({
            title,
            description,
            image,
            slug: newBookSlug,
            authorId: newAuthor.id,
        }, {
            where: {slug: bookSlug}
        });
        res.redirect(`/books/${newBookSlug}`);
    } catch (e) {
        console.log(e);
    }
};

exports.postDeleteBook = async (req, res) => {
    const book = await Book.findOne({where: {slug: req.params.slug}, include: Author});
    const hasRights = hasRightsFunction(req, book.creatorId);
    if (!hasRights) {
        return res.status(403).redirect('/books');
    }

    await Book.destroy({where: {slug: req.params.slug}});
    res.redirect('/books');
};

exports.postRateBook = async (req, res) => {
    const {rating, statusReading} = req.body;
    try {
        const book = await Book.findOne({where: {slug: req.params.slug}});

        const data = {
            rate: +rating,
            status: +statusReading,
            bookId: book.id,
            userId: req.session.user.id
        };

        await Rating.updateOrCreate(data);

        res.redirect('/books');
    } catch (e) {
        console.log(e);
    }
};