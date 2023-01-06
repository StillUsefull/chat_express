import db from '../../db/index';
import User from '../user';
const roomModel = db.models.room;

export default class Room {
    create(data, callback){
        const newRoom = new roomModel(data);
        newRoom.save(callback);
    };
    findOne(data, callback){
        roomModel.findOne(data, callback);
    };
    findById(id, callback){
        roomModel.findById(id, callback);
    };
    findAndUpdate(id, data, callback){
        roomModel.findByIdAndUpdate(id, data, {new: true}, callback);
    };
    addUser(room, socket, callback){
        const userId = socket.request.session.passport.user;
        const connection = {userId: userId, socketId: socket.id};
        room.connections.push(connection); 
        room.save(callback);
    };
    removeUser(room, socket, callback){
        const userId = socket.request.session.passport.user;
        const connection = {userId: userId, socketId: socket.id};
        room.connections.deleteOne(connection);
        room.save(callback);
    }
}
