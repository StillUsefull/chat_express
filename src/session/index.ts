import session from 'express-session';
const MongoStore = require('connect-mongo')(session);
import db from '../data/db/index';

const Session = () => {
    return session({
        secret: process.env.CONNECTION_SECRET,
        resave: false,
        unset: 'destroy',
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: db.Mongoose.connection })
    });
};
export default Session;