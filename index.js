const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const sequelize = require('./utils/database');
const session = require('express-session');
const SequelizeSessionStore = require("connect-session-sequelize")(session.Store);
const csrf = require('csurf');
const flash = require('connect-flash');

const varMiddleware = require('./middleware/variables');
const fileMiddleware = require('./middleware/file');

//settings
const app = express();

// handlebars setup
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeSessionStore({
        db: sequelize,
    }),
}));


//middleware use
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);


//models associations
const UserModel = require('./models/user');
const AuthorModel = require('./models/author');
const BookModel = require('./models/book');
const RatingModel = require('./models/rating');


//one to many Book - Author
AuthorModel.hasMany(BookModel, {foreignKey: {name: 'authorId', allowNull: false}});
BookModel.belongsTo(AuthorModel);

//one to many Author - User
UserModel.hasMany(AuthorModel, {foreignKey: {name: 'creatorId', allowNull: false}});
// AuthorModel.belongsTo(UserModel);

//one to many Book - User
UserModel.hasMany(BookModel, {foreignKey: {name: 'creatorId', allowNull: false}});
// BookModel.belongsTo(UserModel);

//one to many Rating - Book
BookModel.hasMany(RatingModel, {foreignKey: {name: 'bookId', allowNull: false}});
RatingModel.belongsTo(UserModel);

//one to many Rating - User
UserModel.hasMany(RatingModel, {foreignKey: {name: 'userId', allowNull: false}});
RatingModel.belongsTo(BookModel);


//routes declare
const homeRoutes = require('./routes/home');
const bookRoutes = require('./routes/book');
const authRoutes = require('./routes/auth');
const authorRoutes = require('./routes/author');
const accountRoutes = require('./routes/account');
const readerRoutes = require('./routes/reader');

app.use('/', homeRoutes);
app.use('/books', bookRoutes);
app.use('/auth', authRoutes);
app.use('/author', authorRoutes);
app.use('/account', accountRoutes);
app.use('/reader', readerRoutes);

const PORT = process.env.PORT || 3000;

sequelize
    .sync()
    .then(result => {
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    });
