import enableWs from 'express-ws';
import Room from '../data/entities/room';
import { createClient } from 'redis';
const redis 	= require('redis').createClient;
var adapter = require('socket.io-redis');
const ioEvents = (io) => {

	
	io.of('/rooms').on('connection', function(socket) {
		socket.on('createRoom', function(title) {
			Room.findOne({'title': title}, function(err, room){
				if(err) throw err;
				if(room){
					socket.emit('updateRoomsList', { error: 'Room title already exists.' });
				} else {
					Room.create({ 
						title: title
					}, function(err, newRoom){
						if(err) throw err;
						socket.emit('updateRoomsList', newRoom);
						socket.broadcast.emit('updateRoomsList', newRoom);
					});
				}
			});
		});
	});

	io.of('/chatroom').on('connection', function(socket) {

		socket.on('join', function(roomId) {
			Room.findById(roomId, function(err, room){
				if(err) throw err;
				if(!room){
					socket.emit('updateUsersList', { error: 'Room doesnt exist.' });
				} else {
					if(socket.request.session.passport == null){
						return;
					}

					Room.addUser(room, socket, function(err, newRoom){

						
						socket.join(newRoom.id);

						Room.getUsers(newRoom, socket, function(err, users, cuntUserInRoom){
							if(err) throw err;
							socket.emit('updateUsersList', users, true);
							if(cuntUserInRoom === 1){
								socket.broadcast.to(newRoom.id).emit('updateUsersList', users[users.length - 1]);
							}
						});
					});
				}
			});
		});
		socket.on('disconnect', function() {
			if(socket.request.session.passport == null){
				return;
			}

			
			Room.removeUser(socket, function(err, room, userId, cuntUserInRoom){
				if(err) throw err;
				socket.leave(room.id);
				if(cuntUserInRoom === 1){
					socket.broadcast.to(room.id).emit('removeUser', userId);
				}
			});
		});

		
		socket.on('newMessage', function(roomId, message) {
			socket.broadcast.to(roomId).emit('addMessage', message);
		});

	});
}


export default function init(app){

	const server 	= require('http').Server(app);
	const io 		= require('socket.io')(server);
	io.set('transports', ['websocket']);
	const port = process.env.REDIS_PORT;
	const host = process.env.REDIS_HOST;
	const password = process.env.PASSWORD
	let pubClient = redis(port, host, { auth_pass: password });
	let subClient = redis(port, host, { auth_pass: password, return_buffers: true, });
	io.adapter(adapter({ pubClient, subClient }));
	io.use((socket, next) => {
		require('../session')(socket.request, {}, next);
	});
	ioEvents(io);
	return server;
}