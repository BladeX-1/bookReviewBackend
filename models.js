const { Sequelize, DataTypes, Op } = require("sequelize");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// Connect to SQL database
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOSTNAME,
        port: process.env.DATABASE_PORT,
        dialect: "mysql", // Use 'mysql' or 'postgres' as needed
        dialectOptions: {
            ssl: {
                cert: fs.readFileSync(
                    path.join(__dirname, process.env.DATABASE_CA_CERT_LOCATION)
                ),
                ca: fs.readFileSync(
                    path.join(__dirname, process.env.DATABASE_CA_CERT_LOCATION)
                ),
            },
        },
    }
);

// Define Models
const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
});

const Book = sequelize.define("Book", {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    genre: { type: DataTypes.STRING, allowNull: false },
});

const Review = sequelize.define("Review", {
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false },
});

User.hasMany(Review);
Review.belongsTo(User);
Book.hasMany(Review);
Review.belongsTo(Book);

Book.create({ title: "testTitle", author: "testAuthor", genre: "testGenre" });

module.exports = { User, Review, Book, sequelize };
