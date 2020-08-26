const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/database');
const Rating = require('./rating');

class Book extends Model {}

Book.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'book'
});

/**
 * @param id // book id
 * @returns {Promise<string>} //average book rating
 */

Book.applyTotalRating = async function (id) {
    const bookRatingList = await Rating.findAll({where: {status: 2, bookId: id}});

    const totalRating = (bookRatingList.reduce((sum, rating) => {
            return sum + +rating.rate;
        }, 0
    ) / bookRatingList.length).toFixed(1);

    return Promise.resolve(totalRating);
};

module.exports = Book;

