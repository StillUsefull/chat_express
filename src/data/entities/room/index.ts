import db from '../../db/index';
import User from '../user';
const roomModel = db.models.room;

const Room = {
    create(data, callback){
        const newRoom = new roomModel(data);
        newRoom.save(callback);
    },
    findOne(data, callback){
        roomModel.findOne(data, callback);
    },
    findById(id, callback){
        roomModel.findById(id, callback);
    },
    findAndUpdate(id, data, callback){
        roomModel.findByIdAndUpdate(id, data, {new: true}, callback);
    },
    addUser(room, socket, callback){
        const userId = socket.request.session.passport.user;
        const connection = {userId: userId, socketId: socket.id};
        room.connections.push(connection); 
        room.save(callback);
    },
    getUsers(room, socket, callback){

        var users = [], cunt = 0;
        var userId = socket.request.session.passport.user;

        room.connections.forEach((connect) => {
            if(connect.userId === userId){
                cunt++;
            }
        });
        var loadedUsers = 0;		
        users.forEach(function(userId, i){
            User.findById(userId, function(err, user){
                if (err) { return callback(err); }
                users[i] = user;
                if(++loadedUsers === users.length){
                    return callback(null, users, cunt);
                }
            });
        });
    },
    find(data, callback){
        roomModel.find(data, callback);
    },
    removeUser(socket, callback){

        
        const userId = socket.request.session.passport.user;
    
        Room.find(userId, function(err, rooms){
            if(err) { return callback(err); }
                rooms.every(function(room){
                var pass = true, cunt = 0, target = 0;
                room.connections.forEach(function(conn, i){
                    if(conn.userId === userId){
                        cunt++;
                    }
                    if(conn.socketId === socket.id){
                        pass = false, target = i;
                    }
                });
                if(!pass) {
                    room.connections.id(room.connections[target]._id).remove();
                    room.save(function(err){
                        callback(err, room, userId, cunt);
                    });
                }
    
                return pass;
            });
        });
    }
}
export default Room;