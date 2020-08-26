const {Sequelize, DataTypes, Model, Op} = require('sequelize');
const sequelize = require('../utils/database');
const slugify = require('slugify');

function normalizeAuthorData (authorRaw) {
    const splitedAuthor = authorRaw.split(' ');
    return {
        authorName: splitedAuthor[0],
        authorSurname: splitedAuthor[1]
    }
}

class Author extends Model {}

Author.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    about: {
        type: DataTypes.TEXT
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'author'
});

Author.prototype.fullName = function() {
    return `${this.name} ${this.surname}`;
};


Author.fullName = function (name, surname) {
    return `${name} ${surname}`;
};

/**
 * @param {Object} authorRaw // Contains raw string with author name and surname
 * @param {req}  req // express 'req' object
 */
Author.createRaw = async function (authorRaw, req) {
    try {
        const {authorName, authorSurname} = normalizeAuthorData(authorRaw);

        const newAuthor = await Author.create({
            name: authorName,
            surname: authorSurname,
            slug: slugify(`${authorName} ${authorSurname}`),
            creatorId: req.session.user.id
        });
        return Promise.resolve(newAuthor);
    } catch (e) {
        console.log(e);
    }
};

/**
 * @param {Object} authorRaw // Contains raw string with author name and surname
 */
Author.findOneRaw = async function (authorRaw) {
    try {
        const {authorName, authorSurname} = normalizeAuthorData(authorRaw);

        let newAuthor = await Author.findOne({
            where: {
                [Op.or]: [{name: authorName, surname: authorSurname}, {name: authorName, surname: authorSurname}]
            }
        });
        return Promise.resolve(newAuthor);
    } catch (e) {
        console.log(e);
    }
};



module.exports = Author;
