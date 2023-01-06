import db from '../../db/index';


const userModel = db.models.user;

export default class User {
    create(data, callback){
        const newUser = new userModel(data);
        newUser.save(callback);
    }
    findOne(data, callback){
        userModel.findOne(data, callback);
    }
    findById(id, callback){
        userModel.findById(id, callback);
    }
    isAuth(req, res, next){
        if (req.isAuthenticated()){
            next();
        } 
        else {
            res.redirect('/login');
        }
    }

}