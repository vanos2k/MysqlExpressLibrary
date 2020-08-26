const User = require('../models/user');
const {getBookSetByUserAndTitle} = require('../utils/queries');
const Book = require('../models/book');
const Author = require('../models/author');
const Rating = require('../models/rating');

const sortOptions = [
    {sortOptionTitle: 'By user rating', sortCode: 0},
    {sortOptionTitle: 'By date', sortCode: 1},
    {sortOptionTitle: 'By title', sortCode: 2},
    // {sortOptionTitle: 'By Author', sortCode: 3},
    // {sortOptionTitle: 'By book rating', sortCode: 4}
];

async function assignTotalratingToBooks (books) {
    for (let i = 0, j = books.length; i < j; i++) {
        const newValue = await Book.applyTotalRating(books[i].id);
        Object.assign(books[i], {totalRating: newValue});
    }
    return books;
}

/**
 * @param {int} sortChoice // sort choice
 * @param {int} status // status of rating
 * @param {int} userId // Rate owner id
 * @returns {Promise<*>} // Sorted rating list
 */
async function sortUserRating (sortChoice, status, username) {
    let query = '';
    switch (+sortChoice) {
        case 0:
            query = {where: {status}, order: [[Book, 'rate', 'ASC']], include: [{model: Book, include: {model: Author}}, {model: User, attributes: ['username'], where: {username}}]};
            break;
        case 1:
            query = {where: {status}, order: [[Book, 'createdAt', 'ASC']], include: [{model: Book, include: {model: Author}}, {model: User, attributes: ['username'], where: {username}}]};
            break;
        case 2:
            query = {where: {status}, order: [[Book, 'title', 'ASC']], include: [{model: Book, include: {model: Author}}, {model: User, attributes: ['username'], where: {username}}]};
            break;
        // case 3:
        //     query = {where: {status}, order: [[Author, 'name', 'ASC'], ['authorM', 'surname', 'ASC']], include: [{model: Book, include: {model: Author}}, {model: User, attributes: [], where: {username}}]};
        //     break;
        // case 4:
        //     query = {where: {status}, order: [['rate', 'ASC']], include: {model: Book}};
        //     break;
    }
    return await Rating.findAll(query);
}


exports.getReader = async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({where: {username}});

        res.render('reader/reader', {
            title: `${user.username} profile`,
            isProfile: true,
            error: req.flash('error'),
            user
        });
    } catch (e) {
        console.log(e);
    }
};

exports.getReaderRead = async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({where: {username}});

        const {count, rows} = await Rating.findAndCountAll({
            where:{
                status: 2,
                userId: user.id
            },
            include: [{model: Book, include: Author}]
        });

        const ratingList = [];

        for (let i = 0; i < rows.length; i++) {
            ratingList.push(await rows[i].applyCountTotalRating());
        }

        res.render('reader/reader-read', {
            title: `${user.username} read`,
            isRead: true,
            user: user,
            status: 2,
            countRead: count,
            sortOptions,
            ratingList
        });

    } catch (e) {
        console.log(e);
    }
};

exports.getReaderWanttoread = async (req, res) => {
    const user =  await User.findOne({where: {username: req.params.username}});
    let ratings = await Book.findAll({include: [Author, {model: Rating, where: {status: [0,1]}}]});

    ratings = await assignTotalratingToBooks(ratings);

    res.render('reader/reader-wanttoread', {
        title: `${user.username} want to read`,
        user: user,
        status: 0,
        isWanttoread: true,
        sortOptions,
        books: ratings
    });
};

exports.postFindByReaderValue = async (req, res) => {
    const {value, status} = req.query;
    const {username} = req.params;
    let ratings = await getBookSetByUserAndTitle(value, username, status);
    ratings = await assignTotalratingToBooks(ratings);
    res.status(200).json(ratings);
};

exports.postSortRating = async (req, res) => {
    const {sortCode, status} = req.query;
    const {username} = req.params;

    let ratings = sortUserRating(sortCode, status, username);
    ratings = await assignTotalratingToBooks(ratings);
    console.log(ratings.totalRating);

    res.status(200).json(ratings);
};