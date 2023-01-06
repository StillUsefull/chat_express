import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    connections: { type: [{ userId: String, socketId: String }]}
})

const RoomModel = mongoose.model('room', RoomSchema);
export default RoomModel;