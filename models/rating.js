const {DataTypes, Model} = require('sequelize');
const sequelize = require('../utils/database');

class Rating extends Model {}

Rating.init({
    rate: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    tableName: 'rating'
});


Rating.statusOptions = (function () {
    const statusOptions = [
        {statusTitle: 'Want to read', statusCode: 0},
        {statusTitle: 'Reading', statusCode: 1},
        {statusTitle: 'Read', statusCode: 2},
    ];
    return function () {
        return statusOptions;
    }
})();


/**
 * @param {Object} data // Contains fields from Rating model
*/
Rating.updateOrCreate = async function (data) {
    const where = {where: {userId: data.userId, bookId: data.bookId}};

    const rating = await Rating.findOne(where);

    if (rating) {
        await Rating.update(data, where);
    } else {
        await Rating.create(data);
    }
};



Rating.prototype.applyCountTotalRating = async function () {
    const ratingList = await Rating.findAll({
        where: {
            status: 2,
            bookId: this.bookId
        }});

    const totalBookRating = (ratingList.reduce((sum, rating) => {
        return sum + +rating.rate;
        }, 0
    ) / ratingList.length).toFixed(1);

    return Promise.resolve(Object.assign(this, {totalBookRating}));
};

module.exports = Rating;