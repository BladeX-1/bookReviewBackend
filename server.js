// Book Review API using Node.js, Express, and SQL (with Sequelize)

const express = require("express");
const app = express();
const { sequelize } = require("./models.js");

global.appRoot = __dirname;

app.set("view engine", "ejs");

// routers
const booksRouter = require("./routes/books.js").router;
const reviewsRouter = require("./routes/reviews.js").router;
const signupRouter = require("./routes/signup.js").router;
const loginRouter = require("./routes/login.js").router;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/books", booksRouter);
app.use("/reviews", reviewsRouter);

// GET /search – Search books by title or author (partial and case-insensitive)

// Sync database and start server
sequelize.sync().then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
});
