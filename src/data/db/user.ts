import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, defailt: null},
    id: {type: String, required: true}
});
UserSchema.methods
const UserModel = mongoose.model('user', UserSchema);
export default UserModel;