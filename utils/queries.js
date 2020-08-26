const {QueryTypes} = require('sequelize');
const Sequelize = require('./database');

exports.getBookSetByUserAndTitle = async (title, username, status) => {
    const result = await Sequelize.query(`
        SELECT b.title, b.description, b.slug as bSlug, b.image, r.rate, r.userId, b.id, a.slug as aSlug, a.name as aName, a.surname as aSurname
        FROM books AS b 
        INNER JOIN rating AS r ON r.bookId=b.id 
        INNER JOIN authors as a ON b.authorId=a.id
        INNER JOIN user AS u ON r.userId=u.id 
        WHERE u.username = '${username}' and b.title = '${title}' and r.status = ${status}`
    ,{
        type: QueryTypes.SELECT,
    });
    return Promise.resolve(result);
};