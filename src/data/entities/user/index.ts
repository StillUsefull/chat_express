import db from '../../db/index';


const userModel = db.models.user;

const User =  {
    create(data, callback){
        const newUser = new userModel(data);
        newUser.save(callback);
    },
    findOne(data, callback){
        userModel.findOne(data, callback);
    },
    findById(id, callback){
        userModel.findById(id, callback);
    },
    isAuth(req, res, next){
        if (req.isAuthenticated()){
            next();
        } 
        else {
            res.redirect('/login');
        }
    },
    findOrCreate(data, callback){
        userModel.findOne({'socialId': data.id}, function(err, user){
            if(err) { return callback(err); }
            if(user){
                return callback(err, user);
            } else {
                var userData = {
                    username: data.displayName,
                    socialId: data.id,
                    picture: data.photos[0].value || null
                };
    
               
                if(data.provider == "facebook" && userData.picture){
                    userData.picture = "http://graph.facebook.com/" + data.id + "/picture?type=large";
                }
    
                const newUser = new userModel(data);
                newUser.save(callback);
            }
        });
    }
    

}
export default User;