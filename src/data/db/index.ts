import  Mongoose  from 'mongoose';
import path from 'path';
import UserModel from './user';
import RoomModel from './room';
const URL = path.join('mongodb://', 
                        process.env.MONGO_USERNAME, ':',
                        process.env.MONGO_PASSWORD, "@",
                        process.env.MONGO_HOST, ":",
                        process.env.MONGO_PORT, '/',
                        process.env.MONGO_NAME
                    ) 
Mongoose.connect(URL, {useNewUrlParser: true });

Mongoose.connection.on('error', (err) => {
    if (err) throw err;
});

const db = { Mongoose, 
	models: {
		user: UserModel,
		room: RoomModel
	}
};
export default db;