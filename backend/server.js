const express = require('express');
const mongoose = require('mongoose');
const keys = require('./keys/dev');

const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const cors = require("cors");

const carsRouter = require('./routes/cars');
const rentsRouter = require('./routes/rents');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users')

const PORT = 8888;

const app = express();

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
});


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true, exposedHeaders: ['Set-Cookie', 'Date', 'ETag'] }))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        sameSite: "lax",
    },
    name: "carStore",
    path: "/",
    store
}));

app.use("/api/v0/cars", carsRouter);
app.use("/api/v0/rents", rentsRouter);
app.use("/api/v0/auth", authRouter);
app.use("/spec", usersRouter)


async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {useNewUrlParser: true});
        console.log('+ db connection established');

        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}...`);
        })
    } catch(e) {
        console.log(e);
    }
}

start();
